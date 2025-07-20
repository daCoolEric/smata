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
  ChevronRight,
  BatteryCharging,
  Bookmark,
  Zap,
  Heart,
  Coins,
  Flame,
  Trophy,
  Shield,
  Sun,
  Moon as MoonIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Confetti from "react-confetti";
import { useTheme } from "next-themes";
import { supabase } from "../../config/supabaseClient";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Today");
  const [coins, setCoins] = useState(250);
  const [health, setHealth] = useState(80);
  const [streak, setStreak] = useState(3);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [mockExams, setMockExams] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [studyGroups, setStudyGroups] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const { user, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  // Fetch all user data from Supabase
  useEffect(() => {
    if (!user?.id) return;

    const fetchUserData = async () => {
      try {
        setLoadingData(true);

        // Fetch user stats
        const { data: stats, error: statsError } = await supabase
          .from("user_stats")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (statsError && statsError.code !== "PGRST116") throw statsError;

        if (stats) {
          setCoins(stats.coins || 250);
          setHealth(stats.health || 80);
          setStreak(stats.streak || 3);
          setCompletedSessions(stats.completed_sessions || 0);
        } else {
          // Initialize stats if they don't exist
          const { error: insertError } = await supabase
            .from("user_stats")
            .insert([
              {
                user_id: user.id,
                coins: 250,
                health: 80,
                streak: 3,
                completed_sessions: 0,
              },
            ]);

          if (insertError) throw insertError;
        }

        // Fetch exams
        const { data: exams, error: examsError } = await supabase
          .from("exams")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: true });

        if (examsError) throw examsError;
        setMockExams(exams || []);

        // Fetch notes
        const { data: notes, error: notesError } = await supabase
          .from("notes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3);

        if (notesError) throw notesError;
        setRecentNotes(notes || []);

        // Fetch study groups
        const { data: groups, error: groupsError } = await supabase
          .from("user_study_groups")
          .select(
            `
            study_groups (
              id,
              name,
              subject,
              member_count
            )
          `
          )
          .eq("user_id", user.id);

        if (groupsError) throw groupsError;
        setStudyGroups(
          groups?.map((g) => ({
            id: g.study_groups.id,
            name: g.study_groups.name,
            subject: g.study_groups.subject,
            members: g.study_groups.member_count,
          })) || []
        );
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingData(false);
        setMounted(true);
      }
    };

    fetchUserData();
  }, [user?.id]);

  // Update stats in Supabase when they change
  useEffect(() => {
    if (!mounted || !user?.id) return;

    const updateStats = async () => {
      try {
        const { error } = await supabase
          .from("user_stats")
          .upsert({
            user_id: user.id,
            coins,
            health,
            streak,
            completed_sessions: completedSessions,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);

        if (error) throw error;
      } catch (err) {
        console.error("Error updating stats:", err);
      }
    };

    updateStats();
  }, [coins, health, streak, completedSessions, mounted, user?.id]);

  // Add a new study session
  const addStudySession = async () => {
    try {
      const newSessions = completedSessions + 1;
      const newCoins = coins + 10;

      // Optimistic UI update
      setCompletedSessions(newSessions);
      setCoins(newCoins);

      // Update in Supabase
      await supabase
        .from("user_stats")
        .update({
          completed_sessions: newSessions,
          coins: newCoins,
        })
        .eq("user_id", user.id);
    } catch (err) {
      console.error("Error adding session:", err);
      // Rollback on error
      setCompletedSessions(completedSessions);
      setCoins(coins);
    }
  };

  // Claim daily reward
  const claimDailyReward = async () => {
    if (streak > 0) {
      try {
        const newCoins = coins + streak * 10;

        // Optimistic UI update
        setCoins(newCoins);
        setShowConfetti(true);

        // Update in Supabase
        await supabase
          .from("user_stats")
          .update({ coins: newCoins })
          .eq("user_id", user.id);

        setTimeout(() => setShowConfetti(false), 2000);
      } catch (err) {
        console.error("Error claiming reward:", err);
        setCoins(coins); // Rollback on error
      }
    }
  };

  const now = new Date();

  // Prevent rendering until after client-side hydration
  if (!mounted) return null;

  // Show loading state
  if (authLoading || loadingData) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) return null;

  return (
    <div className="bg-[hsl(var(--main-bg))] min-h-screen p-4 md:p-6">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Greeting Card */}
          <div className="bg-[hsl(var(--card-background))] rounded-2xl p-6 shadow-sm border border-[hsl(var(--card-border))] hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
            {completedSessions >= 3 && (
              <div className="absolute top-4 right-4 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Trophy className="w-3 h-3" /> Daily Goal Achieved!
              </div>
            )}

            <h2 className="text-2xl font-semibold mb-2 text-[hsl(var(--foreground))]">
              Good{" "}
              {now.getHours() < 12
                ? "Morning"
                : now.getHours() < 18
                ? "Afternoon"
                : "Evening"}
              {user?.user_metadata?.first_name
                ? `, ${user.user_metadata.first_name}`
                : ""}
              .
            </h2>

            <div className="w-full bg-[hsl(var(--progress-bar-bg))] rounded-full h-2.5 mb-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full"
                style={{ width: `${Math.min(completedSessions * 33, 100)}%` }}
              ></div>
            </div>

            <p className="text-[hsl(var(--timestamp-color))] mb-4">
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
                onClick={() => router.push("/home/energize")}
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
                onClick={() => router.push("/home/focus")}
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
                onClick={() => router.push("/home/study")}
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
              {/* Study Session */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Today's Study Sessions
                  </h4>
                  <button
                    onClick={addStudySession}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Session
                  </button>
                </div>

                {completedSessions > 0 ? (
                  <div className="space-y-2">
                    {[...Array(completedSessions)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Session {i + 1} - {["25m", "50m", "2h"][i] || "25m"} -
                          +10 coins
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No sessions recorded yet
                  </p>
                )}
              </div>

              {/* Upcoming exams */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Upcoming Exams
                  </h4>
                  <button
                    onClick={() => router.push("/home/schedule")}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Exam
                  </button>
                </div>

                <div className="space-y-3">
                  {mockExams.length > 0 ? (
                    mockExams.map((exam) => (
                      <div key={exam.id} className="flex items-start gap-3">
                        <div className="mt-0.5 w-2 h-2 bg-red-500 rounded-full"></div>
                        <div>
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {exam.subject}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {exam.date} • {exam.days_left} days left
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No exams scheduled
                    </p>
                  )}
                </div>
              </div>

              {/* Recent Notes */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Recent Notes
                  </h4>
                  <button
                    onClick={() => router.push("/home/notes")}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Create New
                  </button>
                </div>

                <div className="space-y-3">
                  {recentNotes.length > 0 ? (
                    recentNotes.map((note) => (
                      <div
                        key={note.id}
                        className="p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600/50"
                        onClick={() => router.push(`/home/notes/${note.id}`)}
                      >
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                          {note.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {note.subject} •{" "}
                          {new Date(note.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No recent notes
                    </p>
                  )}
                </div>
              </div>

              {/* Study Resource */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recommended Resources
                </h4>

                <div className="space-y-2">
                  <button className="w-full text-left p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600/50 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      Calculus Textbook
                    </span>
                  </button>
                  <button className="w-full text-left p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600/50 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-purple-500" />
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      Cognitive Science Papers
                    </span>
                  </button>
                  <button className="w-full text-left p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600/50 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      Quick Physics Formulas
                    </span>
                  </button>
                </div>
              </div>

              {/* Study Collaboration */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Study Groups
                  </h4>
                  <button
                    onClick={() => router.push("/home/groups")}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Join Group
                  </button>
                </div>

                <div className="space-y-3">
                  {studyGroups.length > 0 ? (
                    studyGroups.map((group) => (
                      <div key={group.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold">
                          {group.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {group.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {group.members} members • {group.subject}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Not in any study groups
                    </p>
                  )}
                </div>
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
              onClick={claimDailyReward}
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
      </div>
    </div>
  );
}
