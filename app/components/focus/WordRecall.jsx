"use client";
import { useState, useEffect } from "react";

export default function WordRecall() {
  const [words] = useState([
    "Abstract",
    "Banana",
    "Chromatic",
    "Delta",
    "Eclipse",
  ]);
  const [showWords, setShowWords] = useState(false); // Start false for SSR
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(null); // Use null for initial state

  useEffect(() => {
    setShowWords(true);
    const timer = setTimeout(() => setShowWords(false), 10000);
    return () => clearTimeout(timer);
  }, []); // Empty dependency to run once

  const checkAnswers = () => {
    const inputWords = userInput.toLowerCase().split(/\s+/);
    const correct = words.filter((word) =>
      inputWords.includes(word.toLowerCase())
    );
    setScore(correct.length * 10);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      {showWords ? (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold">Memorize these words:</h3>
          <ul className="grid grid-cols-3 gap-2">
            {words.map((word, i) => (
              <li key={i} className="p-2 bg-blue-100 rounded">
                {word}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Type all words you remember, separated by spaces..."
          />
          <button
            onClick={checkAnswers}
            className="w-full bg-green-500 text-white p-2 rounded"
          >
            Submit
          </button>
          {score !== null && <p className="mt-2 text-center">Score: {score}</p>}
        </div>
      )}
    </div>
  );
}
