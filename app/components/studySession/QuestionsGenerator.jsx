"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function QuestionGenerator({
  selectedText,
  onProficiencyChange,
  darkMode: initialDarkMode = false,
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
  const [darkMode, setDarkMode] = useState(initialDarkMode);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

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

  // Theme classes
  const bgColor = darkMode ? "bg-gray-900" : "bg-gray-50";
  const textColor = darkMode ? "text-gray-100" : "text-gray-900";
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";
  const cardBorder = darkMode ? "border-gray-700" : "border-gray-200";
  const inputBg = darkMode ? "bg-gray-700" : "bg-white";
  const inputBorder = darkMode ? "border-gray-600" : "border-gray-300";
  const buttonPrimary = darkMode
    ? "bg-indigo-600 hover:bg-indigo-700"
    : "bg-indigo-600 hover:bg-indigo-700";
  const buttonSecondary = darkMode
    ? "bg-gray-700 hover:bg-gray-600"
    : "bg-gray-200 hover:bg-gray-300";
  const buttonSuccess = darkMode
    ? "bg-green-600 hover:bg-green-700"
    : "bg-green-600 hover:bg-green-700";
  const labelColor = darkMode ? "text-gray-300" : "text-gray-700";
  const feedbackCorrect = darkMode
    ? "bg-green-900 border-green-700 text-green-200"
    : "bg-green-50 border-green-500 text-green-700";
  const feedbackIncorrect = darkMode
    ? "bg-yellow-900 border-yellow-700 text-yellow-200"
    : "bg-yellow-50 border-yellow-500 text-yellow-700";
  const progressBg = darkMode ? "bg-gray-700" : "bg-gray-200";
  const progressBar = darkMode ? "bg-indigo-500" : "bg-indigo-600";
  const questionCounterBg = darkMode
    ? "bg-gray-700 text-gray-200"
    : "bg-gray-100 text-gray-700";
  const correctAnswerBg = darkMode
    ? "bg-green-900 text-green-200"
    : "bg-green-100 text-green-700";
  const incorrectAnswerBg = darkMode
    ? "bg-red-900 text-red-200"
    : "bg-red-100 text-red-700";
  const dividerColor = darkMode ? "divide-gray-700" : "divide-gray-200";

  const renderInputStep = () => (
    <div className={`flex flex-col space-y-6 max-w-3xl mx-auto ${textColor}`}>
      <div
        className={`${cardBg} p-3 rounded-lg shadow-lg border ${cardBorder}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Assessment Settings</h2>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-yellow-300"
                : "bg-gray-200 text-gray-700"
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${labelColor}`}>
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
              className={`mt-1 p-3 block w-full rounded-md ${inputBg} border ${inputBorder} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${textColor}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${labelColor}`}>
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
              className={`mt-1 p-3 block w-full rounded-md ${inputBg} border ${inputBorder} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${textColor}`}
            >
              {[3, 5, 10].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium ${labelColor}`}>
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
              className={`mt-1 p-3 block w-full rounded-md ${inputBg} border ${inputBorder} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${textColor}`}
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="true-false">True/False</option>
              <option value="short-answer">Short Answer</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div
          className={`border-l-4 border-red-500 p-4 rounded-lg ${
            darkMode ? "bg-red-900 text-red-200" : "bg-red-50 text-red-700"
          }`}
        >
          <p>{error}</p>
        </div>
      )}

      <button
        onClick={generateQuestions}
        disabled={loading || !text.trim()}
        className={`${buttonPrimary} text-white py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? "Generating..." : "Generate Test"}
      </button>
    </div>
  );

  const renderCurrentQuestion = () => {
    if (!questions.length) return null;
    const currentQuestion = questions[currentQuestionIdx];

    return (
      <div className={`space-y-6 ${textColor}`}>
        <div
          className={`${cardBg} p-6 rounded-lg shadow-lg border ${cardBorder}`}
        >
          <div className="mb-6">
            <span
              className={`${questionCounterBg} text-sm font-medium px-3 py-1 rounded-full`}
            >
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
                    className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 ${
                      darkMode ? "bg-gray-700" : "bg-white"
                    }`}
                  />
                  <label
                    htmlFor={`option-${idx}`}
                    className={`ml-3 block ${textColor}`}
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
                  className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 ${
                    darkMode ? "bg-gray-700" : "bg-white"
                  }`}
                />
                <label htmlFor="true" className={`ml-3 block ${textColor}`}>
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
                  className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 ${
                    darkMode ? "bg-gray-700" : "bg-white"
                  }`}
                />
                <label htmlFor="false" className={`ml-3 block ${textColor}`}>
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
                className={`mt-1 block w-full rounded-md ${inputBg} border ${inputBorder} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${textColor} disabled:${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              />
            </div>
          )}
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-md border-l-4 ${
              isCorrect ? feedbackCorrect : feedbackIncorrect
            }`}
          >
            {feedback}
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentStep("input")}
            className={`${buttonSecondary} py-2 px-4 rounded-md ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Back to Settings
          </button>
          <div className="flex space-x-2">
            <button
              onClick={submitAnswer}
              disabled={loading || userAnswer === null || answerSubmitted}
              className={`${buttonPrimary} text-white py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? "Submitting..." : "Submit Answer"}
            </button>
            <button
              onClick={moveToNextQuestion}
              disabled={!answerSubmitted}
              className={`${buttonSuccess} text-white py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed`}
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
      <div className={`space-y-6 ${textColor}`}>
        <div
          className={`${cardBg} p-6 rounded-lg shadow-lg border ${cardBorder}`}
        >
          <h2 className="text-xl font-semibold mb-4">Assessment Results</h2>
          <div className="mb-6">
            <div className="max-w-screen mb-2">
              {proficiencyScore !== null && (
                <div
                  className={`mt-4 mb-4 p-4 rounded-lg border ${cardBorder}`}
                >
                  <h3 className="font-semibold text-lg mb-2">
                    Your proficiency: {proficiencyScore}%
                  </h3>

                  {proficiencyScore >= 80 ? (
                    <div className={`${correctAnswerBg} p-2 rounded`}>
                      <p>Excellent! You've mastered this content.</p>
                    </div>
                  ) : (
                    <div className={`${incorrectAnswerBg} p-2 rounded`}>
                      <p>
                        Keep going! We recommend reviewing the material again to
                        improve your understanding.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className={`w-full ${progressBg} rounded-full h-2.5`}>
              <div
                className={`${progressBar} h-2.5 rounded-full`}
                style={{
                  width: `${proficiencyScore}%`,
                  maxWidth: "100%",
                }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div
              className={`${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              } p-3 rounded-md`}
            >
              <p
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-500"
                } text-sm`}
              >
                Total Questions
              </p>
              <p className="text-2xl font-bold">{totalQuestions}</p>
            </div>
            <div
              className={`${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              } p-3 rounded-md`}
            >
              <p
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-500"
                } text-sm`}
              >
                Correct Answers
              </p>
              <p className="text-2xl font-bold">{correctCount}</p>
            </div>
          </div>
        </div>
        <div
          className={`${cardBg} p-6 rounded-lg shadow-lg border ${cardBorder}`}
        >
          <h3 className="text-lg font-semibold mb-4">Review Questions</h3>
          <div className={`divide-y ${dividerColor}`}>
            {questions.map((q, idx) => (
              <div key={idx} className="py-4">
                <div className="flex items-start">
                  <div
                    className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                      q.status === "correct"
                        ? darkMode
                          ? "bg-green-800 text-green-200"
                          : "bg-green-100 text-green-500"
                        : darkMode
                        ? "bg-red-800 text-red-200"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {q.status === "correct" ? "✓" : "✗"}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${textColor}`}>
                      {q.question}
                    </p>
                    {q.studentAnswer !== null && (
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        } mt-1`}
                      >
                        <span className="font-medium">Your answer:</span>{" "}
                        {typeof q.studentAnswer === "boolean"
                          ? q.studentAnswer
                            ? "True"
                            : "False"
                          : q.studentAnswer}
                      </p>
                    )}
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      } mt-1`}
                    >
                      <span className="font-medium">Correct answer:</span>{" "}
                      {typeof q.answer === "boolean"
                        ? q.answer
                          ? "True"
                          : "False"
                        : q.answer}
                    </p>
                    {q.explanation && (
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        } mt-2 italic`}
                      >
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
          <span
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Progress: {progress.completed} of {progress.total} completed
          </span>
          <span className={`text-sm font-medium ${textColor}`}>
            {percentage}%
          </span>
        </div>
        <div className={`w-full ${progressBg} rounded-full h-2.5`}>
          <div
            className={`${progressBar} h-2.5 rounded-full`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen ${bgColor} py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300`}
    >
      <div className="max-w-3xl mx-auto">
        {currentStep === "input" && renderInputStep()}
        {currentStep === "quiz" && (
          <div className={`space-y-6 ${textColor}`}>
            {renderProgressBar()}
            {renderCurrentQuestion()}
          </div>
        )}
        {currentStep === "results" && (
          <div className={`space-y-6 ${textColor}`}>
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
