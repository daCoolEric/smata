"use client";
import { useState, useEffect } from "react";

export default function NumberSequence() {
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [level, setLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [message, setMessage] = useState("");

  const generateSequence = () => {
    const newSeq = [];
    for (let i = 0; i < 2 + level; i++) {
      newSeq.push(Math.floor(Math.random() * 9) + 1);
    }
    setSequence(newSeq);
    setUserInput([]);
    setMessage(`Memorize this sequence: ${newSeq.join(", ")}`);

    // Clear the message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  const handleNumberClick = (num) => {
    if (!gameStarted || sequence.length === 0) return;

    const newInput = [...userInput, num];
    setUserInput(newInput);

    if (newInput.length === sequence.length) {
      const isCorrect = newInput.every((val, i) => val === sequence[i]);

      if (isCorrect) {
        setLevel((l) => l + 1);
        setMessage("Correct! Leveling up...");
        setTimeout(generateSequence, 1500);
      } else {
        setMessage(`Wrong! The sequence was: ${sequence.join(", ")}`);
        setTimeout(() => {
          setMessage("Try again!");
          generateSequence();
        }, 2000);
      }
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setLevel(1);
    generateSequence();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">
        Number Sequence Memory
      </h2>

      {message && (
        <p
          className={`text-center mb-4 ${
            message.includes("Correct")
              ? "text-green-500"
              : message.includes("Wrong")
              ? "text-red-500"
              : "text-blue-500"
          }`}
        >
          {message}
        </p>
      )}

      <p className="text-center mb-4">Level: {level}</p>

      {sequence.length > 0 ? (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className="p-4 bg-gray-200 hover:bg-gray-300 rounded-lg text-xl transition-colors"
                disabled={!gameStarted}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="text-center">
            <p>Your input: {userInput.join(", ")}</p>
          </div>
        </>
      ) : (
        <div className="text-center">
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  );
}
