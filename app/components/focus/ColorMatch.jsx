"use client";
import { useState } from "react";

export default function StroopTest() {
  const colors = ["red", "blue", "green", "yellow"];
  const [currentItem, setCurrentItem] = useState({
    word: "blue",
    color: "red",
  });
  const [score, setScore] = useState(0);

  const generateNewItem = () => {
    const word = colors[Math.floor(Math.random() * colors.length)];
    let color = colors[Math.floor(Math.random() * colors.length)];
    while (color === word) {
      color = colors[Math.floor(Math.random() * colors.length)];
    }
    setCurrentItem({ word, color });
  };

  const handleChoice = (selectedColor) => {
    if (selectedColor === currentItem.color) {
      setScore((s) => s + 5);
      generateNewItem();
    } else {
      setScore((s) => Math.max(0, s - 2));
    }
  };

  // Color mapping for Tailwind classes
  const colorClasses = {
    red: "bg-red-500 hover:bg-red-600",
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Stroop Test</h2>

      <div className="text-center space-y-6">
        <p
          className="text-3xl font-bold mb-8"
          style={{ color: currentItem.color }}
        >
          {currentItem.word.toUpperCase()}
        </p>

        <div className="grid grid-cols-2 gap-4">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleChoice(color)}
              className={`p-4 rounded-lg text-white font-medium transition-colors ${colorClasses[color]}`}
            >
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </button>
          ))}
        </div>

        <p className="text-xl font-semibold">Score: {score}</p>
      </div>
    </div>
  );
}
