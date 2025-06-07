"use client";
import { useState, useEffect } from "react";
import BreathingExercise from "../../components/focus/BreathingExercise";
import StroopTest from "../../components/focus/ColorMatch";
import WordRecall from "@/app/components/focus/WordRecall";
import NumberSequence from "@/app/components/focus/NumberSequence";
import FocusTunnel from "@/app/components/focus/FocusFunnel";
import SoundFocus from "@/app/components/focus/SoundFocus";

const tools = [
  {
    id: 1,
    name: "Breathing Exercise",
    component: <BreathingExercise />,
    color: "bg-blue-100",
  },
  {
    id: 2,
    name: "Sound Focus",
    component: <SoundFocus />,
    color: "bg-purple-100",
  },
  {
    id: 3,
    name: "Color Match",
    component: <StroopTest />,
    color: "bg-green-100",
  },
  {
    id: 4,
    name: "Word Recall",
    component: <WordRecall />,
    color: "bg-yellow-100",
  },
  {
    id: 5,
    name: "Number Sequence",
    component: <NumberSequence />,
    color: "bg-red-100",
  },
  {
    id: 6,
    name: "Focus Tunnel",
    component: <FocusTunnel />,
    color: "bg-indigo-100",
  },
];

export default function MeditationSection() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [randomizedTools, setRandomizedTools] = useState([]);

  useEffect(() => {
    // Shuffle tools on initial load
    setRandomizedTools([...tools].sort(() => 0.5 - Math.random()));
  }, []);

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
  };

  const resetSelection = () => {
    setSelectedTool(null);
    // Re-shuffle tools when going back
    setRandomizedTools([...tools].sort(() => 0.5 - Math.random()));
  };

  return (
    <div className="min-h-screen py-12 px-4 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Mindful Study Tools
      </h1>

      {selectedTool ? (
        <div className="space-y-8">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={resetSelection}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to all tools
            </button>
            <h2 className="text-2xl font-semibold text-gray-700">
              {selectedTool.name}
            </h2>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            {selectedTool.component}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {randomizedTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => handleToolSelect(tool)}
              className={`${tool.color} rounded-xl shadow-md overflow-hidden transition-all transform hover:scale-105 hover:shadow-lg cursor-pointer`}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {tool.name}
                </h3>
                <p className="text-gray-600">
                  Click to start this mindful exercise
                </p>
              </div>
              <div className="h-40 flex items-center justify-center bg-white bg-opacity-50">
                <div className="text-4xl text-gray-600 opacity-30">
                  {tool.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
