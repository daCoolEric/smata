"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function QuestionGenerator({
  selectedText,
  onProficiencyChange,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [text, setText] = useState("");
  const [questions, setQuestions] = useState([]);
  const [progress, setProgress] = useState(null);
  const [currentStep, setCurrentStep] = useState("input");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [quizSettings, setQuizSettings] = useState({
    numQuestions: 5,
    questionType: "multiple-choice",
    documentName: "Text Material",
  });

  // Sync selectedText with internal state
  useEffect(() => {
    if (selectedText) {
      setText(selectedText);
    }
  }, [selectedText]);

  // Calculate and report proficiency score to parent
  useEffect(() => {
    if (questions.length > 0) {
      const correctCount = questions.filter(
        (q) => q.status === "correct"
      ).length;
      const totalQuestions = questions.length;
      const proficiencyScore = Math.round(
        (correctCount / totalQuestions) * 100
      );

      // Report the score back to the parent if onProficiencyChange is provided
      if (onProficiencyChange) {
        onProficiencyChange(proficiencyScore);
      }
    }
  }, [questions, onProficiencyChange]);

  const generateQuestions = async () => {
    if (!text.trim()) {
      setError("Please provide text content to generate questions");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/generate-questions", {
        text,
        numQuestions: quizSettings.numQuestions,
        questionType: quizSettings.questionType,
        documentName: quizSettings.documentName,
      });

      setQuestions(response.data.questions);
      setProgress(response.data.progress);
      setCurrentStep("quiz");
      setCurrentQuestionIdx(0);
      setUserAnswer(null);
      setFeedback(null);
      setIsCorrect(false);
      setAnswerSubmitted(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (userAnswer === null || answerSubmitted) return;

    setLoading(true);
    setError(null);

    try {
      const currentQuestion = questions[currentQuestionIdx];
      const questionId = currentQuestion.id || currentQuestion.question;

      const response = await axios.put("/api/generate-questions", {
        questionId,
        studentAnswer: userAnswer,
        questions,
        progress,
      });

      setQuestions(response.data.questions);
      setProgress(response.data.progress);
      setFeedback(response.data.questionResult.feedback);
      setIsCorrect(response.data.questionResult.isCorrect);
      setAnswerSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit answer");
    } finally {
      setLoading(false);
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setUserAnswer(null);
      setFeedback(null);
      setIsCorrect(false);
      setAnswerSubmitted(false);
    } else {
      setCurrentStep("results");
    }
  };

  const renderInputStep = () => (
    <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Assessment Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Name
            </label>
            <input
              type="text"
              value={quizSettings.documentName}
              onChange={(e) =>
                setQuizSettings({
                  ...quizSettings,
                  documentName: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Questions
            </label>
            <select
              value={quizSettings.numQuestions}
              onChange={(e) =>
                setQuizSettings({
                  ...quizSettings,
                  numQuestions: Number(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {[3, 5, 10].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Question Type
            </label>
            <select
              value={quizSettings.questionType}
              onChange={(e) =>
                setQuizSettings({
                  ...quizSettings,
                  questionType: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="true-false">True/False</option>
              <option value="short-answer">Short Answer</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <button
        onClick={generateQuestions}
        disabled={loading || !text.trim()}
        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Generating..." : "Generate Test"}
      </button>
    </div>
  );

  const renderCurrentQuestion = () => {
    if (!questions.length) return null;
    const currentQuestion = questions[currentQuestionIdx];

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-6">
            <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
              Question {currentQuestionIdx + 1} of {questions.length}
            </span>
          </div>
          <h2 className="text-xl font-semibold mb-4">
            {currentQuestion.question}
          </h2>

          {currentQuestion.options ? (
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <div key={idx} className="flex items-center">
                  <input
                    type="radio"
                    id={`option-${idx}`}
                    name="answer"
                    value={option}
                    checked={userAnswer === option}
                    onChange={() => setUserAnswer(option)}
                    disabled={answerSubmitted}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={`option-${idx}`}
                    className="ml-3 block text-gray-700"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ) : typeof currentQuestion.answer === "boolean" ? (
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="true"
                  name="answer"
                  checked={userAnswer === true}
                  onChange={() => setUserAnswer(true)}
                  disabled={answerSubmitted}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="true" className="ml-3 block text-gray-700">
                  True
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="false"
                  name="answer"
                  checked={userAnswer === false}
                  onChange={() => setUserAnswer(false)}
                  disabled={answerSubmitted}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="false" className="ml-3 block text-gray-700">
                  False
                </label>
              </div>
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={userAnswer || ""}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here..."
                disabled={answerSubmitted}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
              />
            </div>
          )}
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-md ${
              isCorrect
                ? "bg-green-50 border-green-500 text-green-700"
                : "bg-yellow-50 border-yellow-500 text-yellow-700"
            } border-l-4`}
          >
            {feedback}
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentStep("input")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
          >
            Back to Settings
          </button>
          <div className="flex space-x-2">
            <button
              onClick={submitAnswer}
              disabled={loading || userAnswer === null || answerSubmitted}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Answer"}
            </button>
            <button
              onClick={moveToNextQuestion}
              disabled={!answerSubmitted}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Question
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderResultsStep = () => {
    const correctCount = questions.filter((q) => q.status === "correct").length;
    const totalQuestions = questions.length;
    const proficiencyScore = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Assessment Results</h2>
          <div className="mb-6">
            <div className="max-w-screen mb-2">
              {proficiencyScore !== null && (
                <div className="mt-4 mb-4 p-4 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-2">
                    Your proficiency: {proficiencyScore}%
                  </h3>

                  {proficiencyScore >= 80 ? (
                    <div className="text-green-600 mb-3">
                      <p>Excellent! You've mastered this content.</p>
                    </div>
                  ) : (
                    <div className="text-amber-600 mb-3">
                      <p>
                        Keep going! We recommend reviewing the material again to
                        improve your understanding.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{
                  width: `${proficiencyScore}%`,
                  maxWidth: "100%",
                }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-gray-500 text-sm">Total Questions</p>
              <p className="text-2xl font-bold">{totalQuestions}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-gray-500 text-sm">Correct Answers</p>
              <p className="text-2xl font-bold">{correctCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Review Questions</h3>
          <div className="divide-y divide-gray-200">
            {questions.map((q, idx) => (
              <div key={idx} className="py-4">
                <div className="flex items-start">
                  <div
                    className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                      q.status === "correct"
                        ? "bg-green-100 text-green-500"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {q.status === "correct" ? "✓" : "✗"}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {q.question}
                    </p>
                    {q.studentAnswer !== null && (
                      <p className="text-sm text-gray-500 mt-1">
                        <span className="font-medium">Your answer:</span>{" "}
                        {typeof q.studentAnswer === "boolean"
                          ? q.studentAnswer
                            ? "True"
                            : "False"
                          : q.studentAnswer}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-medium">Correct answer:</span>{" "}
                      {typeof q.answer === "boolean"
                        ? q.answer
                          ? "True"
                          : "False"
                        : q.answer}
                    </p>
                    {q.explanation && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderProgressBar = () => {
    if (!progress) return null;
    const percentage = Math.round(
      ((progress.completed || 0) / (progress.total || 1)) * 100
    );

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            Progress: {progress.completed} of {progress.total} completed
          </span>
          <span className="text-sm font-medium">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {currentStep === "input" && renderInputStep()}
        {currentStep === "quiz" && (
          <div className="space-y-6">
            {/* <h1 className="text-2xl font-bold text-center">
              {quizSettings.documentName} - Assessment
            </h1> */}
            {renderProgressBar()}
            {renderCurrentQuestion()}
          </div>
        )}
        {currentStep === "results" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-center">
              {quizSettings.documentName} - Results
            </h1>
            {renderResultsStep()}
          </div>
        )}
      </div>
    </div>
  );
}
