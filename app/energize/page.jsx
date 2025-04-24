"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFire, FaTrophy, FaQuoteLeft, FaPlay, FaPause } from "react-icons/fa";

export default function MotivationApp() {
  // States
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25-minute timer
  const [isActive, setIsActive] = useState(false);
  const [quote, setQuote] = useState("");
  const [energyLevel, setEnergyLevel] = useState(50);
  const [showAffirmation, setShowAffirmation] = useState(false);

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
    "You’ve got this!",
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center"
      >
        <h1 className="text-3xl font-bold text-purple-600 mb-4">
          🔥 Stay Energized! 🔥
        </h1>

        {/* Motivational Quote */}
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <FaQuoteLeft className="text-gray-400 mb-2" />
          <p className="text-lg italic">{quote}</p>
          <button
            onClick={getRandomQuote}
            className="mt-2 text-sm text-purple-600 hover:underline"
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
              className="px-4 py-2 bg-gray-200 rounded-lg"
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
            <div className="bg-white p-6 rounded-lg shadow-xl text-center">
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                {affirmations[Math.floor(Math.random() * affirmations.length)]}
              </h3>
              <p>Great job! 🎉</p>
            </div>
          </motion.div>
        )}

        {/* Progress Tracker */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center justify-center gap-2">
            <FaTrophy className="text-yellow-500" /> Today's Progress
          </h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
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
