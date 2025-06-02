"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaFire,
  FaTrophy,
  FaQuoteLeft,
  FaPlay,
  FaPause,
  FaSun,
  FaMoon,
} from "react-icons/fa";

export default function MotivationApp() {
  // States
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25-minute timer
  const [isActive, setIsActive] = useState(false);
  const [quote, setQuote] = useState("");
  const [energyLevel, setEnergyLevel] = useState(50);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Motivational Quotes
  const quotes = [
    "Success is the sum of small efforts repeated daily.",
    "You are capable of amazing things!",
    "Every expert was once a beginner.",
    "Stay focused, stay determined.",
    "Progress, not perfection.",
  ];

  // Positive Affirmations
  const affirmations = [
    "You're doing great!",
    "Keep going!",
    "One step at a time!",
    "You've got this!",
  ];

  // Fetch a random quote
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  // Timer logic
  useEffect(() => {
    let interval;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setShowAffirmation(true);
      setEnergyLevel((prev) => Math.min(prev + 10, 100)); // Boost energy on completion
      setTimeout(() => setShowAffirmation(false), 3000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Start/Pause timer
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Initialize a quote on load
  useEffect(() => {
    getRandomQuote();
  }, []);

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
        darkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-b from-blue-50 to-purple-50 text-gray-800"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-md w-full rounded-xl shadow-lg p-6 text-center transition-colors duration-300 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Theme Toggle */}
        <div className="flex justify-end mb-2">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-yellow-300"
                : "bg-gray-200 text-gray-700"
            }`}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <h1
          className={`text-3xl font-bold mb-4 ${
            darkMode ? "text-purple-400" : "text-purple-600"
          }`}
        >
          🔥 Stay Energized! 🔥
        </h1>

        {/* Motivational Quote */}
        <div
          className={`mb-6 p-4 rounded-lg transition-colors duration-300 ${
            darkMode ? "bg-gray-700" : "bg-yellow-50"
          }`}
        >
          <FaQuoteLeft
            className={`mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          />
          <p className="text-lg italic">{quote}</p>
          <button
            onClick={getRandomQuote}
            className={`mt-2 text-sm ${
              darkMode
                ? "text-purple-400 hover:underline"
                : "text-purple-600 hover:underline"
            }`}
          >
            New Quote
          </button>
        </div>

        {/* Energy Booster Timer */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Focus Timer</h2>
            <div className="flex items-center">
              <FaFire className="text-orange-500 mr-1" />
              <span>Energy: {energyLevel}%</span>
            </div>
          </div>
          <div className="text-5xl font-bold my-4">{formatTime(timeLeft)}</div>
          <div className="flex justify-center gap-4">
            <button
              onClick={toggleTimer}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                isActive ? "bg-red-500 text-white" : "bg-green-500 text-white"
              }`}
            >
              {isActive ? (
                <>
                  <FaPause /> Pause
                </>
              ) : (
                <>
                  <FaPlay /> Start
                </>
              )}
            </button>
            <button
              onClick={resetTimer}
              className={`px-4 py-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Affirmation Popup */}
        {showAffirmation && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div
              className={`p-6 rounded-lg shadow-xl text-center ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3
                className={`text-2xl font-bold mb-2 ${
                  darkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                {affirmations[Math.floor(Math.random() * affirmations.length)]}
              </h3>
              <p>Great job! �</p>
            </div>
          </motion.div>
        )}

        {/* Progress Tracker */}
        <div
          className={`mt-6 p-4 rounded-lg transition-colors duration-300 ${
            darkMode ? "bg-gray-700" : "bg-blue-50"
          }`}
        >
          <h3 className="font-semibold mb-2 flex items-center justify-center gap-2">
            <FaTrophy className="text-yellow-500" /> Today's Progress
          </h3>
          <div
            className={`w-full rounded-full h-4 ${
              darkMode ? "bg-gray-600" : "bg-gray-200"
            }`}
          >
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: `${energyLevel}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm">
            {energyLevel >= 80
              ? "You're unstoppable! 🚀"
              : energyLevel >= 50
              ? "Keep pushing! 💪"
              : "Let's boost your energy! 🔥"}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
