"use client";
import { useState, useEffect, useRef } from "react";

export default function SoundFocus() {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetFrequency, setTargetFrequency] = useState(null);
  const [options, setOptions] = useState([]);
  const audioContextRef = useRef(null);
  const [feedback, setFeedback] = useState({ message: "", isCorrect: null });
  const [gameState, setGameState] = useState("idle"); // idle, playing, guessing, feedback, completed
  const [volume, setVolume] = useState(0.5);
  const [difficulty, setDifficulty] = useState(1); // 1-3 scale
  const [streak, setStreak] = useState(0); // Track consecutive correct answers

  // Expanded musical notes (two octaves with more variety)
  const frequencies = [
    { freq: 261.63, note: "C4", color: "bg-red-500" },
    { freq: 277.18, note: "C#4", color: "bg-red-600" },
    { freq: 293.66, note: "D4", color: "bg-orange-500" },
    { freq: 311.13, note: "D#4", color: "bg-orange-600" },
    { freq: 329.63, note: "E4", color: "bg-yellow-500" },
    { freq: 349.23, note: "F4", color: "bg-lime-500" },
    { freq: 369.99, note: "F#4", color: "bg-lime-600" },
    { freq: 392.0, note: "G4", color: "bg-green-500" },
    { freq: 415.3, note: "G#4", color: "bg-green-600" },
    { freq: 440.0, note: "A4", color: "bg-teal-500" },
    { freq: 466.16, note: "A#4", color: "bg-teal-600" },
    { freq: 493.88, note: "B4", color: "bg-blue-500" },
    { freq: 523.25, note: "C5", color: "bg-indigo-500" },
    { freq: 554.37, note: "C#5", color: "bg-indigo-600" },
    { freq: 587.33, note: "D5", color: "bg-purple-500" },
    { freq: 622.25, note: "D#5", color: "bg-purple-600" },
    { freq: 659.25, note: "E5", color: "bg-pink-500" },
    { freq: 698.46, note: "F5", color: "bg-rose-500" },
    { freq: 739.99, note: "F#5", color: "bg-rose-600" },
    { freq: 783.99, note: "G5", color: "bg-amber-500" },
  ];

  // Initialize audio context on first user interaction
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
    startRound();
  };

  // Get a subset of frequencies based on current difficulty
  const getAvailableFrequencies = () => {
    const baseIndex = Math.floor((difficulty - 1) * 5);
    const count = difficulty === 3 ? frequencies.length : 5 + difficulty * 2;
    return frequencies.slice(baseIndex, baseIndex + count);
  };

  // Adjust difficulty based on performance
  const updateDifficulty = (wasCorrect) => {
    if (wasCorrect) {
      setStreak(streak + 1);
      if (streak >= 3 && difficulty < 3) {
        setDifficulty(difficulty + 1);
        setStreak(0);
      }
    } else {
      setStreak(0);
      if (difficulty > 1) {
        setDifficulty(difficulty - 0.5);
      }
    }
  };

  const startRound = () => {
    if (!audioContextRef.current || score >= 20) return;

    setGameState("playing");
    const availableFrequencies = getAvailableFrequencies();
    const randomTarget =
      availableFrequencies[
        Math.floor(Math.random() * availableFrequencies.length)
      ];
    setTargetFrequency(randomTarget);

    // Create options based on difficulty
    const optionCount = Math.min(3 + Math.floor(difficulty), 6);
    const allOptions = frequencies
      .filter((f) => f !== randomTarget)
      .sort(() => Math.random() - 0.5);

    // Select distractors that are closer in frequency as difficulty increases
    const distractors = allOptions
      .sort((a, b) => {
        const diffA = Math.abs(a.freq - randomTarget.freq);
        const diffB = Math.abs(b.freq - randomTarget.freq);
        return diffA - diffB;
      })
      .slice(0, optionCount - 1);

    const shuffledOptions = [randomTarget, ...distractors].sort(
      () => Math.random() - 0.5
    );

    setOptions(shuffledOptions);
    playTone(randomTarget.freq);
  };

  const playTone = (frequency, duration = 1) => {
    if (!audioContextRef.current) return;

    // Resume if suspended
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    // Add some variation to make it more challenging
    oscillator.type = difficulty > 2 ? "triangle" : "sine";
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    // Smooth volume envelope
    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      volume,
      audioContextRef.current.currentTime + 0.1
    );
    gainNode.gain.linearRampToValueAtTime(
      0,
      audioContextRef.current.currentTime + duration - 0.1
    );

    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + duration);

    // Transition to guessing state after playback
    setTimeout(() => {
      setIsPlaying(false);
      setGameState("guessing");
    }, duration * 1000);
  };

  const handleGuess = (selectedOption) => {
    const isCorrect = selectedOption.freq === targetFrequency.freq;

    setFeedback({
      message: isCorrect
        ? `Correct! 🎯 +1 (${targetFrequency.note})`
        : `Try again! 👂 (Was ${targetFrequency.note})`,
      isCorrect,
    });

    setGameState("feedback");
    updateDifficulty(isCorrect);

    if (isCorrect) {
      setScore(score + 1);
    }

    // Check if game is completed
    if (score + 1 >= 20) {
      setGameState("completed");
      return;
    }

    // Move to next round after feedback
    setTimeout(() => {
      setRound(round + 1);
      startRound();
    }, 1500);
  };

  const testSound = (frequency) => {
    if (!audioContextRef.current) return;
    playTone(frequency, 1);
  };

  const resetGame = () => {
    setScore(0);
    setRound(1);
    setDifficulty(1);
    setStreak(0);
    setGameState("idle");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Audio Focus Challenge
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Train your auditory discrimination skills
        </p>

        {gameState === "idle" ? (
          <div className="text-center">
            <div className="mb-6">
              <p className="text-gray-700 mb-2">Test the sounds first:</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {frequencies.slice(0, 9).map((tone, i) => (
                  <button
                    key={i}
                    onClick={() => testSound(tone.freq)}
                    className={`${tone.color} text-white py-2 px-3 rounded-lg hover:opacity-90 transition text-sm`}
                  >
                    {tone.note}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {frequencies.slice(9, 18).map((tone, i) => (
                  <button
                    key={i + 9}
                    onClick={() => testSound(tone.freq)}
                    className={`${tone.color} text-white py-2 px-3 rounded-lg hover:opacity-90 transition text-sm`}
                  >
                    {tone.note}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={initAudio}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Start Challenge
            </button>
          </div>
        ) : gameState === "completed" ? (
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
            <p className="mb-4">
              You completed the challenge with a score of {score} in {round}{" "}
              rounds!
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Your final difficulty level: {difficulty.toFixed(1)}
            </p>
            <button
              onClick={resetGame}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Play Again
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-6">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-gray-600">Round: </span>
                <span className="font-semibold">{round}</span>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-gray-600">Score: </span>
                <span className="font-semibold">{score}/20</span>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-gray-600">Level: </span>
                <span className="font-semibold">{difficulty.toFixed(1)}</span>
              </div>
            </div>

            {gameState === "playing" && (
              <div className="text-center py-8">
                <div className="animate-pulse text-3xl">🔊</div>
                <p className="mt-4 text-gray-700">Listening carefully...</p>
              </div>
            )}

            {gameState === "guessing" && (
              <div className="mb-6">
                <p className="text-center text-gray-700 mb-4">
                  Which tone did you hear?
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleGuess(option)}
                      className={`${option.color} text-white py-3 px-4 rounded-lg hover:opacity-90 transition flex items-center justify-between`}
                    >
                      <span>Option {i + 1}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          testSound(option.freq);
                        }}
                        className="text-white bg-black bg-opacity-20 rounded-full p-1"
                      >
                        🔈
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {gameState === "feedback" && (
              <div
                className={`text-center py-4 rounded-lg mb-6 ${
                  feedback.isCorrect
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <p className="font-medium">{feedback.message}</p>
              </div>
            )}

            <div className="mt-4">
              <label className="flex items-center gap-2 text-gray-700">
                <span>Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full"
                />
                <span>{Math.round(volume * 100)}%</span>
              </label>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={resetGame}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Restart Game
              </button>
            </div>
          </>
        )}

        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            Training your{" "}
            <span className="font-semibold">auditory working memory</span>
          </p>
          <p>Helps with focus in noisy environments</p>
        </div>
      </div>
    </div>
  );
}
