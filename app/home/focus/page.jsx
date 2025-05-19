"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Howl } from "howler";

export default function DistractionDodge() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [distraction, setDistraction] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);

  // Initialize sounds
  const sounds = {
    pop: new Howl({ src: ["/sounds/pop.mp3"] }),
    ding: new Howl({ src: ["/sounds/ding.mp3"] }),
    buzz: new Howl({ src: ["/sounds/buzz.mp3"] }),
  };

  // Game loop
  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);

        // Trigger random distraction
        if (Math.random() > 0.7) {
          triggerDistraction();
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setIsPlaying(true);
    setGameHistory([]);
  };

  const triggerDistraction = () => {
    const distractions = [
      { emoji: "🔔", sound: "pop" },
      { emoji: "💬", sound: "pop" },
      { emoji: "⚠️", sound: "buzz" },
      { emoji: "🎉", sound: "pop" },
    ];

    const randomDistraction =
      distractions[Math.floor(Math.random() * distractions.length)];
    setDistraction(randomDistraction.emoji);
    sounds[randomDistraction.sound].play();

    setTimeout(() => {
      setDistraction(null);
    }, 1500);
  };

  const handleFocusClick = () => {
    setScore((prev) => prev + 10);
    sounds.ding.play();
  };

  const handleDistractionClick = () => {
    setScore((prev) => prev - 5);
    sounds.buzz.play();
    setDistraction(null);
    setGameHistory((prev) => [...prev, "Clicked distraction"]);
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameHistory((prev) => [...prev, `Game ended with ${score} points`]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">Distraction Dodge</h1>

      {!isPlaying ? (
        <button
          onClick={startGame}
          className="bg-green-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-green-600 transition"
        >
          Start Game
        </button>
      ) : (
        <div className="text-center">
          <div className="mb-8">
            <p className="text-2xl">
              Score: <span className="font-bold">{score}</span>
            </p>
            <p className="text-xl">
              Time: <span className="font-bold">{timeLeft}s</span>
            </p>
          </div>

          {/* Focus Target */}
          <div
            onClick={handleFocusClick}
            className="w-32 h-32 bg-blue-500 rounded-lg mx-auto mb-8 cursor-pointer hover:bg-blue-600 transition flex items-center justify-center"
          >
            <span className="text-white text-2xl">Click Me</span>
          </div>

          {/* Distractions */}
          {distraction && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={handleDistractionClick}
              className="fixed text-5xl cursor-pointer select-none z-10"
              style={{
                top: `${Math.random() * 70 + 15}%`,
                left: `${Math.random() * 70 + 15}%`,
              }}
            >
              {distraction}
            </motion.div>
          )}

          <button
            onClick={endGame}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-red-600 transition"
          >
            End Game
          </button>
        </div>
      )}

      {/* Game History */}
      {gameHistory.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-2">Game History</h2>
          <ul className="bg-white p-4 rounded-lg shadow">
            {gameHistory.map((item, index) => (
              <li key={index} className="py-1 border-b last:border-0">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
