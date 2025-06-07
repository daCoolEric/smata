"use client";
import { useState, useEffect, useRef } from "react";

export default function FocusTunnel() {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });
  const [tunnelWidth, setTunnelWidth] = useState(80);
  const gameAreaRef = useRef(null);

  // Start the game
  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setTimeLeft(30);
    setTunnelWidth(80);
    moveTarget();
  };

  // Move target to random position within tunnel
  const moveTarget = () => {
    if (gameOver || !gameStarted) return;

    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    const maxX = 100 - tunnelWidth;
    const newX = Math.random() * maxX;
    const newY = Math.random() * 80 + 10; // Keep within middle 80% vertically

    setTargetPosition({ x: newX, y: newY });
  };

  // Handle click on target
  const handleTargetClick = () => {
    if (gameOver || !gameStarted) return;

    setScore(score + 1);
    setTunnelWidth(Math.max(20, tunnelWidth - 2)); // Make tunnel narrower
    moveTarget();
  };

  // Timer effect
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  return (
    <div className="relative w-full max-w-2xl aspect-video bg-gray-800 rounded-lg overflow-hidden">
      {!gameStarted ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-10">
          <h2 className="text-3xl font-bold text-white mb-4">Focus Tunnel</h2>
          <p className="text-gray-300 mb-8 text-center max-w-md">
            Click the moving target as many times as you can before time runs
            out. The tunnel will get narrower as you score!
          </p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition"
          >
            Start Game
          </button>
        </div>
      ) : gameOver ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-10">
          <h2 className="text-3xl font-bold text-white mb-4">Game Over!</h2>
          <p className="text-2xl text-white mb-6">Your score: {score}</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition"
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div ref={gameAreaRef} className="relative w-full h-full">
            {/* Tunnel walls */}
            <div
              className="absolute top-0 bottom-0 left-0 bg-black"
              style={{ width: `${(100 - tunnelWidth) / 2}%` }}
            ></div>
            <div
              className="absolute top-0 bottom-0 right-0 bg-black"
              style={{ width: `${(100 - tunnelWidth) / 2}%` }}
            ></div>

            {/* Target */}
            <div
              onClick={handleTargetClick}
              className="absolute w-8 h-8 bg-red-500 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
              style={{
                left: `${targetPosition.x + tunnelWidth / 2}%`,
                top: `${targetPosition.y}%`,
                boxShadow: "0 0 15px rgba(239, 68, 68, 0.7)",
              }}
            ></div>
          </div>

          {/* Game info */}
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <div className="bg-gray-900 bg-opacity-70 text-white px-4 py-2 rounded-lg">
              Time: {timeLeft}s
            </div>
            <div className="bg-gray-900 bg-opacity-70 text-white px-4 py-2 rounded-lg">
              Score: {score}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
