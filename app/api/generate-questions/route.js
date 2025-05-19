import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const {
      text,
      numQuestions = 10,
      questionType = "multiple-choice",
      documentName = "the document",
    } = await request.json();

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "No text provided for question generation" },
        { status: 400 }
      );
    }

    const prompt = generatePrompt(
      text,
      numQuestions,
      questionType,
      documentName
    );

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 2000,
      temperature: 0.5,
      system:
        "You are an expert educator. Generate clear, concise questions in valid JSON format.",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.content[0].text;
    const questions = extractQuestions(content);

    // Initialize questions with student interaction fields
    const questionsWithProgress = questions.map((q) => ({
      ...q,
      status: "unattempted", // 'unattempted', 'incorrect', 'correct'
      attempts: 0,
      studentAnswer: null,
      feedback: "",
    }));

    return NextResponse.json({
      questions: questionsWithProgress,
      progress: {
        total: questions.length,
        completed: 0,
        correct: 0,
        proficiency: 0, // 0-100 percentage
      },
    });
  } catch (error) {
    console.error("Generation error:", error.message);
    return NextResponse.json(
      {
        error: "Failed to generate questions",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

function generatePrompt(text, numQuestions, questionType, documentName) {
  const maxTextLength = 5000;
  const truncatedText =
    text.length > maxTextLength
      ? text.substring(0, maxTextLength) + "\n[Content truncated]"
      : text;

  const templates = {
    "multiple-choice": `Generate ${numQuestions} multiple-choice questions about "${documentName}" with 4 options each. 
    Format your response as a JSON object with a "questions" array where each question has:
    - "question": the question text
    - "options": array of 4 answer choices
    - "answer": the correct answer (must exactly match one option)
    - "explanation": a brief explanation of why the answer is correct
    Example: { "questions": [ { "question": "What is...?", "options": ["A", "B", "C", "D"], "answer": "B", "explanation": "B is correct because..." } ] }`,

    "true-false": `Create ${numQuestions} true/false questions from "${documentName}".
    Format your response as a JSON object with a "questions" array where each question has:
    - "question": the statement
    - "answer": boolean true or false
    - "explanation": a brief explanation of why the statement is true or false
    Example: { "questions": [ { "question": "The sky is blue.", "answer": true, "explanation": "This is correct because..." } ] }`,

    "short-answer": `Generate ${numQuestions} short-answer questions about "${documentName}".
    Format your response as a JSON object with a "questions" array where each question has:
    - "question": the question text
    - "answer": the expected short answer
    - "explanation": a brief explanation of the correct answer
    Example: { "questions": [ { "question": "What is the capital of France?", "answer": "Paris", "explanation": "Paris is the capital and largest city of France." } ] }`,
  };

  return `${
    templates[questionType] || templates["multiple-choice"]
  }\n\nText to analyze:\n${truncatedText}\n\nImportant: Return ONLY valid JSON with no additional text or explanation.`;
}

function extractQuestions(content) {
  try {
    const jsonStart = content.indexOf("{");
    const jsonEnd = content.lastIndexOf("}") + 1;
    const jsonString = content.slice(jsonStart, jsonEnd);

    const result = JSON.parse(jsonString);
    if (!result.questions) throw new Error("Missing questions array");
    return result.questions;
  } catch (e) {
    console.error("Failed to parse:", content);
    throw new Error("Invalid response format from API");
  }
}

// New endpoint for grading student answers
export async function PUT(request) {
  try {
    const { questionId, studentAnswer, questions, progress } =
      await request.json();

    if (!questionId || studentAnswer === undefined || !questions) {
      return NextResponse.json(
        { error: "Missing required data for grading" },
        { status: 400 }
      );
    }

    // Find the question in the array
    const questionIndex = questions.findIndex(
      (q) => q.id === questionId || q.question === questionId
    );
    if (questionIndex === -1) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    const question = questions[questionIndex];
    const isCorrect = checkAnswer(question, studentAnswer);

    // Update question status
    const updatedQuestion = {
      ...question,
      studentAnswer,
      attempts: question.attempts + 1,
      status: isCorrect ? "correct" : "incorrect",
      feedback: isCorrect
        ? `Correct! ${question.explanation || ""}`
        : `Incorrect. Please try again. Hint: ${generateHint(question)}`,
    };

    // Update questions array
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = updatedQuestion;

    // Update progress
    const updatedProgress = calculateProgress(updatedQuestions);

    return NextResponse.json({
      questions: updatedQuestions,
      progress: updatedProgress,
      questionResult: {
        questionId,
        isCorrect,
        feedback: updatedQuestion.feedback,
      },
    });
  } catch (error) {
    console.error("Grading error:", error.message);
    return NextResponse.json(
      { error: "Failed to grade answer" },
      { status: 500 }
    );
  }
}

function checkAnswer(question, studentAnswer) {
  // Multiple choice or True/False
  if (question.options) {
    return studentAnswer === question.answer;
  }
  // True/False
  else if (typeof question.answer === "boolean") {
    return studentAnswer === question.answer;
  }
  // Short answer - case insensitive partial match
  else {
    const correctAnswer = question.answer.toLowerCase();
    const givenAnswer = studentAnswer.toLowerCase();
    return (
      givenAnswer.includes(correctAnswer) || correctAnswer.includes(givenAnswer)
    );
  }
}

function generateHint(question) {
  if (question.options) {
    // For multiple choice, eliminate two wrong options
    const wrongOptions = question.options.filter(
      (opt) => opt !== question.answer
    );
    const eliminatedOption =
      wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    return `Consider that "${eliminatedOption}" is not the correct answer.`;
  } else if (typeof question.answer === "boolean") {
    // For true/false
    return "Think carefully about what the text specifically states.";
  } else {
    // For short answer
    return `Your answer should include key concepts related to ${
      question.answer.split(" ")[0]
    }...`;
  }
}

function calculateProgress(questions) {
  const total = questions.length;
  const completed = questions.filter((q) => q.status === "correct").length;
  const attempted = questions.filter((q) => q.attempts > 0).length;

  // Calculate proficiency as percentage of correct answers out of total
  const proficiency = Math.round((completed / total) * 100);

  return {
    total,
    completed,
    attempted,
    correct: completed,
    proficiency,
  };
}
