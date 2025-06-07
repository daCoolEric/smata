"use client"
import { useState, useEffect } from "react";

export default function BreathingExercise() {
  const [phase, setPhase] = useState("inhale");
  const [seconds, setSeconds] = useState(0);
  const [calmPoints, setCalmPoints] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [circleSize, setCircleSize] = useState(100);

  const phaseDurations = {
    inhale: 5,
    hold: 1,
    exhale: 7,
  };

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= phaseDurations[phase] - 1) {
            if (phase === "inhale") setPhase("hold");
            else if (phase === "hold") setPhase("exhale");
            else {
              setPhase("inhale");
              setCalmPoints((prev) => prev + 10);
            }
            return 0;
          }
          return prev + 1;
        });

        if (phase === "inhale") {
          setCircleSize((prev) => Math.min(prev + 15, 200));
        } else if (phase === "exhale") {
          setCircleSize((prev) => Math.max(prev - 10, 100));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase]);

  const phaseColors = {
    inhale: "bg-blue-500",
    hold: "bg-green-500",
    exhale: "bg-blue-500",
  };

  return (
    <div className="max-w-md mx-auto p-5 bg-gray-50 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">
        5-1-7 Breathing Exercise
      </h2>

      <div
        className={`mx-auto rounded-full transition-all duration-1000 ease-in-out ${phaseColors[phase]}`}
        style={{
          width: `${circleSize}px`,
          height: `${circleSize}px`,
        }}
      ></div>

      <p className="text-xl font-bold my-4 text-center">
        {phase.toUpperCase()}: {phaseDurations[phase] - seconds}s
      </p>

      <p className="text-lg text-center mb-4">Calm Points: {calmPoints}</p>

      <button
        onClick={() => setIsActive(!isActive)}
        className={`w-full py-2 px-4 rounded-lg font-medium ${
          isActive
            ? "bg-orange-500 hover:bg-orange-600"
            : "bg-green-500 hover:bg-green-600"
        } text-white transition-colors`}
      >
        {isActive ? "Pause" : "Start"}
      </button>
    </div>
  );
}
