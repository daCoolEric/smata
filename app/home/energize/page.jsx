"use client";

import { useState, useRef } from "react";
import { Play, Trophy, Star, Zap, Heart, Brain } from "lucide-react";

const SpinWheel = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef(null);

  const activities = [
    {
      id: 1,
      name: "Motivational Clip",
      points: 15,
      color: "#3B82F6",
      textColor: "text-white",
      icon: <Play className="w-4 h-4" />,
      description:
        "Watch an inspiring 2-minute motivational video and reflect on one key message that resonates with you.",
      task: "After watching, write down one action you'll take today inspired by the video.",
    },
    {
      id: 2,
      name: "Power Affirmation",
      points: 20,
      color: "#F59E0B",
      textColor: "text-white",
      icon: <Star className="w-4 h-4" />,
      description:
        "Memorize and recite a powerful affirmation with confidence and conviction.",
      task: "Choose from: 'I am capable of achieving my goals' or 'I embrace challenges as opportunities to grow' - practice it 3 times aloud.",
    },
    {
      id: 3,
      name: "Energy Boost",
      points: 10,
      color: "#10B981",
      textColor: "text-white",
      icon: <Zap className="w-4 h-4" />,
      description:
        "Perform a quick 1-minute energy-boosting exercise to get your blood flowing.",
      task: "Do 20 jumping jacks, 10 push-ups, or dance to your favorite song for 1 minute.",
    },
    {
      id: 4,
      name: "Gratitude Moment",
      points: 12,
      color: "#8B5CF6",
      textColor: "text-white",
      icon: <Heart className="w-4 h-4" />,
      description:
        "Take a moment to appreciate something positive in your life right now.",
      task: "Write down 3 things you're grateful for today and why they matter to you.",
    },
    {
      id: 5,
      name: "Brain Teaser",
      points: 25,
      color: "#06B6D4",
      textColor: "text-white",
      icon: <Brain className="w-4 h-4" />,
      description:
        "Challenge your mind with a quick puzzle or riddle to sharpen your focus.",
      task: "Solve this: I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
    },
    {
      id: 6,
      name: "Victory Pose",
      points: 18,
      color: "#DC2626",
      textColor: "text-white",
      icon: <Trophy className="w-4 h-4" />,
      description:
        "Strike a power pose for 30 seconds to boost your confidence and energy.",
      task: "Stand tall, hands on hips or raised above your head, smile, and hold for 30 seconds while thinking positive thoughts.",
    },
  ];

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedActivity(null);

    // Calculate random spins (5-8 full rotations plus random position)
    const minSpins = 5;
    const maxSpins = 8;
    const spins = minSpins + Math.random() * (maxSpins - minSpins);
    const randomAngle = Math.floor(Math.random() * 360);
    const totalRotation = spins * 360 + randomAngle;

    // Add to current rotation for continuous spinning
    const newRotation = rotation + totalRotation;
    setRotation(newRotation);

    setTimeout(() => {
      const segmentAngle = 360 / activities.length;

      // Get the final rotation normalized to 0-360
      const normalizedRotation = newRotation % 360;

      // The pointer is at the top (0°), segments start at top and go clockwise
      // We need to find which segment the pointer is pointing to
      // Since the wheel rotates, we need to reverse the rotation to find the original position
      const pointerAngle = (360 - normalizedRotation) % 360;

      // Calculate which segment the pointer is in
      const selectedIndex =
        Math.floor(pointerAngle / segmentAngle) % activities.length;

      setSelectedActivity(activities[selectedIndex]);
      setIsSpinning(false);
    }, 4500);
  };

  const openModal = () => {
    if (selectedActivity) {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const claimReward = () => {
    alert(`Congratulations! You've earned ${selectedActivity.points} points!`);
    setShowModal(false);
    setSelectedActivity(null);
  };

  const createWheelSegments = () => {
    const segments = [];
    const segmentAngle = 360 / activities.length;
    const centerX = 200;
    const centerY = 200;
    const radius = 180;

    activities.forEach((activity, index) => {
      // Start from top (270° in SVG coordinates, which is 0° in our logical system) and go clockwise
      const startAngle = 270 + index * segmentAngle;
      const endAngle = 270 + (index + 1) * segmentAngle;

      // Convert to radians
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      // Calculate points for the arc
      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const largeArcFlag = segmentAngle > 180 ? 1 : 0;

      // Create path for segment
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        "Z",
      ].join(" ");

      // Calculate text position (middle of segment)
      const midAngle = startAngle + segmentAngle / 2;
      const textRadius = radius * 0.7;
      const textX = centerX + textRadius * Math.cos((midAngle * Math.PI) / 180);
      const textY = centerY + textRadius * Math.sin((midAngle * Math.PI) / 180);

      // Calculate rotation for text to be readable
      let textRotation = midAngle + 90;

      // Flip text if it would be upside down
      if (textRotation > 90 && textRotation < 270) {
        textRotation += 180;
      }

      segments.push(
        <g key={activity.id}>
          <path
            d={pathData}
            fill={activity.color}
            stroke="#ffffff"
            strokeWidth="3"
          />

          <g
            transform={`translate(${textX}, ${textY}) rotate(${textRotation})`}
          >
            <foreignObject x="-12" y="-30" width="24" height="24">
              <div className="flex items-center justify-center text-white">
                {activity.icon}
              </div>
            </foreignObject>

            <text
              x="0"
              y="-8"
              textAnchor="middle"
              className="fill-white text-sm font-bold"
              dominantBaseline="middle"
            >
              {activity.name}
            </text>

            <text
              x="0"
              y="8"
              textAnchor="middle"
              className="fill-yellow-200 text-xs font-bold"
              dominantBaseline="middle"
            >
              {activity.points}pts
            </text>
          </g>
        </g>
      );
    });

    return segments;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
          Energize Wheel
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Spin the wheel and complete energizing activities to earn points and
          boost your motivation!
        </p>
      </div>

      <div className="relative mb-8">
        <div className="relative w-96 h-96">
          {/* Fixed Pointer at top */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-yellow-400 drop-shadow-lg"></div>
          </div>

          {/* Spinning Wheel */}
          <div
            className={`w-full h-full transition-transform ${
              isSpinning ? "duration-[4500ms] ease-out" : "duration-0"
            }`}
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: "center",
            }}
          >
            <svg
              ref={wheelRef}
              width="100%"
              height="100%"
              viewBox="0 0 400 400"
              className="drop-shadow-2xl"
            >
              <circle
                cx="200"
                cy="200"
                r="190"
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="8"
              />

              {createWheelSegments()}

              <circle
                cx="200"
                cy="200"
                r="25"
                fill="#1F2937"
                stroke="#ffffff"
                strokeWidth="4"
              />
              <g transform="translate(200, 200)">
                <foreignObject x="-8" y="-8" width="16" height="16">
                  <Zap className="w-4 h-4 text-yellow-400" />
                </foreignObject>
              </g>
            </svg>
          </div>
        </div>

        {selectedActivity && !isSpinning && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
            Final rotation: {(rotation % 360).toFixed(1)}°
          </div>
        )}
      </div>

      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className={`px-8 py-4 text-xl font-bold rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg ${
          isSpinning
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 active:scale-95"
        }`}
      >
        {isSpinning ? "Spinning..." : "SPIN THE WHEEL!"}
      </button>

      {selectedActivity && !isSpinning && (
        <div className="mt-6 text-center">
          <div className="mb-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
            <h3 className="text-2xl font-bold text-white mb-2">
              You landed on: {selectedActivity.name}
            </h3>
            <p className="text-lg text-gray-300">
              Worth {selectedActivity.points} points!
            </p>
          </div>
          <button
            onClick={openModal}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-full hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Start Activity & Claim Reward
          </button>
        </div>
      )}

      {showModal && selectedActivity && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all">
            <div className="text-center mb-6">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full text-white mb-4"
                style={{ backgroundColor: selectedActivity.color }}
              >
                {selectedActivity.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedActivity.name}
              </h2>
              <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                {selectedActivity.points} Points
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Your Mission:
              </h3>
              <p className="text-gray-700 mb-4">
                {selectedActivity.description}
              </p>

              <h3 className="font-semibold text-gray-900 mb-2">Task:</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {selectedActivity.task}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={claimReward}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-semibold"
              >
                Complete & Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinWheel;
