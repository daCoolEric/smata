import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Trophy,
  BatteryCharging,
  Zap,
  Brain,
  Moon,
  BookOpen,
  Bookmark,
  ChevronRight,
  Plus,
  Coins,
  Shield,
  Heart,
  Flame,
  Clock
} from 'lucide-react';

const Dashboard = ({ user }) => {
  const router = useRouter();
  const [now, setNow] = useState(new Date());
  const [completedSessions, setCompletedSessions] = useState(2);
  const [health, setHealth] = useState(75);
  const [coins, setCoins] = useState(150);
  const [streak, setStreak] = useState(2);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setNow(new Date());
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="md:col-span-2 space-y-6">
        {/* Greeting Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100/50 dark:border-gray-700/30 hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
          {completedSessions >= 3 && (
            <div className="absolute top-4 right-4 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Trophy className="w-3 h-3" /> Daily Goal Achieved!
            </div>
          )}

          <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">
            Good{" "}
            {now.getHours() < 12
              ? "Morning"
              : now.getHours() < 18
              ? "Afternoon"
              : "Evening"}
            {user?.displayName ? `, ${user.displayName}` : ""}.
          </h2>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full"
              style={{ width: `${Math.min(completedSessions * 33, 100)}%` }}
            ></div>
          </div>

          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {completedSessions >= 3
              ? "🔥 You've completed your daily goal! +25 coins"
              : `Complete ${3 - completedSessions} tasks to earn bonus coins`}
          </p>
        </div>

        {/* Energize Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100/50 dark:border-gray-700/30 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <BatteryCharging className="w-5 h-5 text-orange-500 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  Energize
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Energy management
                </p>
              </div>
            </div>
            <div className="font-medium bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-1 rounded-md text-sm">
              {health}/100
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 text-center transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700/60">
            <p className="text-gray-500 dark:text-gray-300 mb-3">
              Energy level running down
            </p>
            <button
              onClick={() => router.push("/energize")}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Zap className="w-4 h-4" />
              <span>Refill (+1 coins)</span>
              <span className="ml-auto bg-white/20 px-1.5 py-0.5 rounded text-xs">
                Boost
              </span>
            </button>
          </div>
        </div>

        {/* Focus Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100/50 dark:border-gray-700/30 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 dark:bg-teal-900/20 rounded-lg">
                <Brain className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  Focus
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Mindfulness & Meditation
                </p>
              </div>
            </div>
            <div className="font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md text-sm">
              40/100
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 text-center transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700/60">
            <p className="text-gray-500 dark:text-gray-300 mb-3">
              Your focus needs replenishing
            </p>
            <button
              onClick={() => router.push("/focus")}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-400 to-teal-500 hover:from-blue-500 hover:to-teal-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Moon className="w-4 h-4" />
              <span>Meditate (+1 focus)</span>
              <span className="ml-auto bg-white/20 px-1.5 py-0.5 rounded text-xs">
                Calm
              </span>
            </button>
          </div>
        </div>

        {/* Study Session Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100/50 dark:border-gray-700/30 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  Study Session
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Knowledge & Concentration
                </p>
              </div>
            </div>
            <div className="font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-md text-sm">
              65/100
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 text-center transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700/60">
            <p className="text-gray-500 dark:text-gray-300 mb-3">
              Ready for a productive session?
            </p>
            <button
              onClick={() => router.push("/study-room")}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Bookmark className="w-4 h-4" />
              <span>Start Studying (+5 XP)</span>
              <span className="ml-auto bg-white/20 px-1.5 py-0.5 rounded text-xs">
                Focus
              </span>
            </button>
          </div>
        </div>

        {/* Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100/50 dark:border-gray-700/30 hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-lg dark:text-white">
                Activities
              </h3>
            </div>
            <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Upcoming exams
              </h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No exams scheduled yet
              </p>
              <button
                onClick={() => setCoins((prev) => prev + 15)}
                className="mt-2 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Schedule Exam (+15 coins)
              </button>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recent notes
              </h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No recent notes
              </p>
              <button
                onClick={() => setCoins((prev) => prev + 5)}
                className="mt-2 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Note (+5 coins)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Rewards Card */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl p-6 text-white">
          <h3 className="font-semibold text-lg mb-2">Daily Rewards</h3>
          <p className="text-purple-100 mb-4">
            Complete tasks to earn coins and maintain your health!
          </p>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 2, 3].map((day) => (
              <div
                key={day}
                className={`p-2 rounded-lg text-center ${
                  day <= streak ? "bg-white/20" : "bg-white/10"
                }`}
              >
                <div className="text-xs mb-1">Day {day}</div>
                <div className="flex justify-center">
                  <Coins className="w-5 h-5 text-yellow-300" />
                </div>
                <div className="text-xs mt-1">{day * 10} coins</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              if (streak > 0) {
                setCoins((prev) => prev + streak * 10);
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 2000);
              }
            }}
            className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
              streak > 0
                ? "bg-white text-purple-600"
                : "bg-white/20 text-white"
            }`}
            disabled={streak === 0}
          >
            Claim {streak * 10} coins
          </button>
        </div>
        
        {/* Stats Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100/50 dark:border-gray-700/30 hover:shadow-md transition-shadow duration-300">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 dark:text-white">
            <Shield className="text-purple-600 dark:text-purple-400" /> Your
            Stats
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-500" /> Coins
              </span>
              <span className="font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-md text-sm">
                {coins}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" /> Health
              </span>
              <span className="font-medium bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-1 rounded-md text-sm">
                {health}/100
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" /> Streak
              </span>
              <span className="font-medium bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-md text-sm">
                {streak} days
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" /> Sessions
              </span>
              <span className="font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md text-sm">
                {completedSessions}/3
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {showConfetti && (
        <div className="confetti-container">
          {/* Add your confetti implementation here */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;