import { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Timer,
  Pause,
  Play,
  CheckCircle,
  Flame,
  Clock,
} from "lucide-react";

const StudySession = ({ initialSubject = "Mathematics" }) => {
  // Session state
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(25 * 60); // Default 25 minutes
  const [sessionDuration, setSessionDuration] = useState(25 * 60);
  const [currentSubject, setCurrentSubject] = useState(initialSubject);

  // Stats
  const [streak, setStreak] = useState(0);
  const [totalMinutesStudied, setTotalMinutesStudied] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);

  // Format time as MM:SS
  const formatTime = useCallback((timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  // Handle timer logic
  useEffect(() => {
    let interval = null;

    if (isActive && !isPaused && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            completeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, remainingTime]);

  // Start a new session
  const startSession = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
    setRemainingTime(sessionDuration);
    // In a real app, you might want to play a start sound here
  }, [sessionDuration]);

  // Pause the current session
  const pauseSession = useCallback(() => {
    setIsPaused(true);
    // You might want to play a pause sound here
  }, []);

  // Resume a paused session
  const resumeSession = useCallback(() => {
    setIsPaused(false);
    // You might want to play a resume sound here
  }, []);

  // Toggle between pause/resume
  const togglePause = useCallback(() => {
    if (isPaused) {
      resumeSession();
    } else {
      pauseSession();
    }
  }, [isPaused, pauseSession, resumeSession]);

  // Complete the session (either finished or manually completed)
  const completeSession = useCallback(() => {
    const minutesStudied = Math.ceil((sessionDuration - remainingTime) / 60);

    // Update stats
    setTotalMinutesStudied((prev) => prev + minutesStudied);
    setCompletedSessions((prev) => prev + 1);

    // Update streak (simplified logic - in a real app you'd check dates)
    if (minutesStudied >= (sessionDuration / 60) * 0.8) {
      // Completed at least 80%
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    // Reset session
    setIsActive(false);
    setIsPaused(false);
    setRemainingTime(sessionDuration);

    // In a real app, you might want to play a completion sound here
  }, [remainingTime, sessionDuration]);

  // Cancel the current session (added for completeness)
  const cancelSession = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    setRemainingTime(sessionDuration);
  }, [sessionDuration]);

  return (
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
              Deep Work Mode
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-md text-sm">
            {formatTime(remainingTime)}
          </div>
          {isActive && (
            <button
              onClick={togglePause}
              className="p-1 text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400"
              aria-label={isPaused ? "Resume session" : "Pause session"}
            >
              {isPaused ? (
                <Play className="w-4 h-4" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress bar */}
        {isActive && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-400 to-purple-500 h-2 rounded-full"
              style={{
                width: `${
                  ((sessionDuration - remainingTime) / sessionDuration) * 100
                }%`,
              }}
            ></div>
          </div>
        )}

        {/* Session controls */}
        <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700/60">
          {!isActive ? (
            <>
              <p className="text-gray-500 dark:text-gray-300 mb-3 text-center">
                Ready for focused work? Select duration:
              </p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[25, 50, 90].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setSessionDuration(mins * 60)}
                    className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                      sessionDuration === mins * 60
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
              <div className="mb-3">
                <label
                  htmlFor="subject"
                  className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
                >
                  What are you studying?
                </label>
                <input
                  id="subject"
                  type="text"
                  value={currentSubject}
                  onChange={(e) => setCurrentSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter subject/topic"
                />
              </div>
              <button
                onClick={startSession}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Timer className="w-4 h-4" />
                <span>Start Session</span>
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-500 dark:text-gray-300 mb-3 text-center">
                {isPaused
                  ? "Session paused"
                  : `Stay focused on: ${currentSubject}`}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={isPaused ? resumeSession : pauseSession}
                  className="flex-1 py-2.5 px-4 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  {isPaused ? (
                    <Play className="w-4 h-4" />
                  ) : (
                    <Pause className="w-4 h-4" />
                  )}
                  <span>{isPaused ? "Resume" : "Pause"}</span>
                </button>
                <button
                  onClick={completeSession}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete</span>
                </button>
              </div>
              {isPaused && (
                <button
                  onClick={cancelSession}
                  className="w-full mt-2 py-2 px-4 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Cancel Session
                </button>
              )}
            </>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-500" />
            <span>{streak} day streak</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-indigo-500" />
            <span>{totalMinutesStudied} mins today</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>{completedSessions} sessions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudySession;
