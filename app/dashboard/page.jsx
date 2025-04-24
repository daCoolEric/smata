// app/dashboard/page.jsx
"use client";
import { useAuth } from "@/context/AuthContext";
import {
  Clock,
  Calendar,
  BookOpen,
  Plus,
  BrainCircuit,
  Brain,
  Moon,
  LogOut,
  ChevronRight,
  BatteryCharging,
  Bookmark,
  Zap,
  Heart,
  Coins,
  Flame,
  Trophy,
  Shield,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Confetti from "react-confetti";

const navIcons = {
  Dashboard: <BrainCircuit className="w-5 h-5" />,
  "Study Plan": <BookOpen className="w-5 h-5" />,
  "Study Sessions": <Clock className="w-5 h-5" />,
  Activities: <Calendar className="w-5 h-5" />,
  SignOut: <LogOut className="w-5 h-5" />,
};

export default function Dashboard() {
  const { user, signOutUser } = useAuth();
  const [activeTab, setActiveTab] = useState("Today");
  const [focusSubject, setFocusSubject] = useState("");
  const [focusTime, setFocusTime] = useState("25:00");
  const [coins, setCoins] = useState(250);
  const [health, setHealth] = useState(80);
  const [streak, setStreak] = useState(3);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  // Game state initialization
  useEffect(() => {
    // Load game state from localStorage
    const savedState = JSON.parse(localStorage.getItem("smataGameState")) || {};
    setCoins(savedState.coins || 250);
    setHealth(savedState.health || 80);
    setStreak(savedState.streak || 3);
    setCompletedSessions(savedState.completedSessions || 0);

    // Check daily logout for health
    const lastLogout = localStorage.getItem("lastLogoutDate");
    const today = new Date().toDateString();
    if (lastLogout !== today) {
      setHealth((prev) => Math.max(prev - 10, 0));
    }
  }, []);

  // Save game state
  useEffect(() => {
    localStorage.setItem(
      "smataGameState",
      JSON.stringify({
        coins,
        health,
        streak,
        completedSessions,
      })
    );
  }, [coins, health, streak, completedSessions]);

  // Log out
  useEffect(() => {
    router.push(user ? "/dashboard" : "/login");
  }, [user, router]);

  const handleSignOut = () => {
    // Reward for daily logout
    const today = new Date().toDateString();
    const lastLogout = localStorage.getItem("lastLogoutDate");
    if (lastLogout !== today) {
      setCoins((prev) => prev + 20);
      setHealth((prev) => Math.min(prev + 5, 100));
      localStorage.setItem("lastLogoutDate", today);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    signOutUser();
  };

  const startFocusSession = () => {
    // Simulate completing a focus session
    const newSessions = completedSessions + 1;
    setCompletedSessions(newSessions);

    // Reward coins based on session length
    const coinReward =
      focusTime === "25:00" ? 10 : focusTime === "50:00" ? 25 : 5;
    setCoins((prev) => prev + coinReward);

    // Increase streak if completed 3 sessions today
    if (newSessions >= 3) {
      setStreak((prev) => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  // Get current time and date
  const now = new Date();
  const currentTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const currentDate = now.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Study Plan", path: "/study-plan" },
    { name: "Study Sessions", path: "/study-sessions" },
    { name: "Activities", path: "/activities" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 pb-20 md:pb-0">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="container mx-auto">
          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  Smata
                </h1>
                <p className="text-sm text-gray-500">
                  {currentTime} · {currentDate}
                </p>
              </div>
            </div>

            {/* Game Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">{coins}</span>
              </div>

              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="font-medium">{health}/100</span>
              </div>

              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-medium">{streak} day streak</span>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-2">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-purple-100"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center">
                    <span className="text-purple-600 font-medium">
                      {user?.displayName?.charAt(0) || "U"}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="hidden md:flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
                >
                  Sign Out
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block border-t border-gray-200/50">
            <div className="flex">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex-1 text-center px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    pathname === item.path
                      ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50/50"
                      : "text-gray-500 hover:text-purple-500 hover:bg-purple-50/30"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-white/90 backdrop-blur-md p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-purple-100 text-purple-600">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Smata
              </h1>
              <p className="text-xs text-gray-500">
                {currentTime} ·{" "}
                {now.toLocaleDateString([], { month: "short", day: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-medium">{coins}</span>
            </div>
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-purple-100"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center">
                <span className="text-purple-600 font-medium">
                  {user?.displayName?.charAt(0) || "U"}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Greeting Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
            {/* Achievement Badge */}
            {completedSessions >= 3 && (
              <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Trophy className="w-3 h-3" /> Daily Goal Achieved!
              </div>
            )}

            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              Good{" "}
              {now.getHours() < 12
                ? "Morning"
                : now.getHours() < 18
                ? "Afternoon"
                : "Evening"}
              {user?.displayName ? `, ${user.displayName}` : ""}.
            </h2>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full"
                style={{ width: `${Math.min(completedSessions * 33, 100)}%` }}
              ></div>
            </div>

            <p className="text-gray-500 mb-4">
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
              <div className="font-medium bg-red-100 text-red-600 px-2 py-1 rounded-md text-sm">
                {health}/100
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 text-center transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700/60">
              <p className="text-gray-500 dark:text-gray-300 mb-3">
                Energy level running down
              </p>
              <button
                // onClick={() => setCoins((prev) => prev + 5)}
                onClick={() => router.push("/energize")}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600w-full text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
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
                // onClick={() => setCoins((prev) => prev + 5)}
                onClick={() => router.push("/focus")}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-400 to-teal-500 hover:from-blue-500 hover:to-teal-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Moon className="w-4 h-4" />
                <span>Meditate (+1 focus )</span>
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
                // onClick={() => setCoins((prev) => prev + 5)}
                onClick={() => router.push("/study-plan")}
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
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="text-purple-600" />
                <h3 className="font-semibold text-lg">Activities</h3>
              </div>
              <button className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  Upcoming exams
                </h4>
                <p className="text-gray-500 text-sm">No exams scheduled yet</p>
                <button
                  onClick={() => setCoins((prev) => prev + 15)}
                  className="mt-2 text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Schedule Exam (+15 coins)
                </button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  Recent notes
                </h4>
                <p className="text-gray-500 text-sm">No recent notes</p>
                <button
                  onClick={() => setCoins((prev) => prev + 5)}
                  className="mt-2 text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Note (+5 coins)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Focus Timer */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-purple-600" />
              <h3 className="font-semibold text-lg">Focus Timer</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-gray-400">(+5 coins)</span>
                </label>
                <input
                  type="text"
                  value={focusSubject}
                  onChange={(e) => setFocusSubject(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
                  placeholder="What are you studying?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={focusTime}
                    onChange={(e) => setFocusTime(e.target.value)}
                    className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all flex-1"
                  >
                    <option value="25:00">25:00 (Pomodoro) +10 coins</option>
                    <option value="50:00">50:00 (Deep Focus) +25 coins</option>
                    <option value="15:00">
                      15:00 (Quick Session) +5 coins
                    </option>
                  </select>
                  <button
                    onClick={startFocusSession}
                    className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-5 py-3 rounded-xl hover:from-purple-700 hover:to-blue-600 transition-all shadow-sm hover:shadow-md flex items-center gap-1"
                  >
                    <Zap className="w-4 h-4" /> Start
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Shield className="text-purple-600" /> Your Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-500" /> Coins
                </span>
                <span className="font-medium bg-yellow-100 text-yellow-600 px-2 py-1 rounded-md text-sm">
                  {coins}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" /> Health
                </span>
                <span className="font-medium bg-red-100 text-red-600 px-2 py-1 rounded-md text-sm">
                  {health}/100
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" /> Streak
                </span>
                <span className="font-medium bg-orange-100 text-orange-600 px-2 py-1 rounded-md text-sm">
                  {streak} days
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" /> Sessions
                </span>
                <span className="font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-md text-sm">
                  {completedSessions}/3
                </span>
              </div>
            </div>
          </div>

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
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg z-20">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center justify-center py-3 px-2 w-full transition-colors ${
                pathname === item.path
                  ? "text-purple-600"
                  : "text-gray-500 hover:text-purple-500"
              }`}
            >
              <div className="w-6 h-6">{navIcons[item.name]}</div>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className={`flex flex-col items-center justify-center py-3 px-2 w-full transition-colors ${
              pathname === "/signout"
                ? "text-purple-600"
                : "text-gray-500 hover:text-purple-500"
            }`}
          >
            <div className="w-6 h-6">{navIcons.SignOut}</div>
            <span className="text-xs mt-1">Sign Out</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
