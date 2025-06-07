"use client";
import { useState, useEffect, useRef } from "react";

export default function LaserFocusGame() {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dotPosition, setDotPosition] = useState({ x: 50, y: 50 });
  const [isTracking, setIsTracking] = useState(false);
  const gameAreaRef = useRef(null);

  useEffect(() => {
    if (!isPlaying) return;

    const moveInterval = setInterval(() => {
      setDotPosition((prev) => ({
        x: Math.min(Math.max(prev.x + (Math.random() * 10 - 5), 10), 90),
        y: Math.min(Math.max(prev.y + (Math.random() * 10 - 5), 10), 90),
      }));
    }, 500);

    const timeInterval = setInterval(() => {
      setTime((prev) => prev + 1);
      if (isTracking) {
        setScore((prev) => prev + 1);
      }
    }, 1000);

    return () => {
      clearInterval(moveInterval);
      clearInterval(timeInterval);
    };
  }, [isPlaying, isTracking]);

  const handleTouchStart = () => {
    if (isPlaying) setIsTracking(true);
  };

  const handleTouchEnd = () => {
    setIsTracking(false);
  };

  return (
    <div className="max-w-md mx-auto p-5 bg-gray-50 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">
        Laser Focus Training
      </h2>
      <p className="text-lg text-center mb-4">
        Score: {score} | Time: {time}s
      </p>

      <div
        ref={gameAreaRef}
        className="relative w-72 h-72 bg-gray-200 mx-auto rounded-xl touch-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
      >
        <div
          className={`absolute w-5 h-5 rounded-full transition-all duration-500 ease-in-out ${
            isTracking ? "bg-green-500" : "bg-red-500"
          }`}
          style={{
            left: `${dotPosition.x}%`,
            top: `${dotPosition.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        ></div>
      </div>

      <button
        onClick={() => {
          setIsPlaying(!isPlaying);
          if (!isPlaying) {
            setScore(0);
            setTime(0);
          }
        }}
        className={`w-full mt-4 py-2 px-4 rounded-lg font-medium ${
          isPlaying
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white transition-colors`}
      >
        {isPlaying ? "Stop" : "Start"}
      </button>
    </div>
  );
}
