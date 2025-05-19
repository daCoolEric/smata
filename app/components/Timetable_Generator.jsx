"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";
import TimetablePDF from "./TimetablePDF";
import { generateTimetable } from "../logic/generateTimetable";
import { useAuth } from "@/context/AuthContext";

// Extracted components
const DaySelection = ({ dayLabels, selectedDay, setSelectedDay, theme }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
    {Object.entries(dayLabels).map(([key, label]) => (
      <label
        key={key}
        className={`flex items-center space-x-2 p-2 rounded-lg border ${
          theme.border
        } cursor-pointer transition-colors ${
          selectedDay === key
            ? theme.cardBg === "bg-gray-800"
              ? "bg-blue-900 border-blue-500"
              : "bg-blue-100 border-blue-300"
            : "hover:bg-opacity-50"
        }`}
      >
        <input
          type="radio"
          name="day-selection"
          checked={selectedDay === key}
          onChange={() => setSelectedDay(key)}
          className={`h-4 w-4 ${
            theme.cardBg === "bg-gray-800"
              ? "accent-blue-400"
              : "accent-blue-500"
          }`}
        />
        <span>{label}</span>
      </label>
    ))}
  </div>
);

const SubjectItem = ({ subject, index, removeSubject, theme }) => (
  <li
    className={`flex items-center justify-between p-3 rounded-lg border ${theme.border} transition-all`}
    style={{ borderLeft: `4px solid ${subject.color}` }}
  >
    <div>
      <div className="font-medium">{subject.name}</div>
      <div className={`text-sm ${theme.secondaryText}`}>
        {subject.duration} • {subject.days.join(", ")} • {subject.weeklyHours}{" "}
        hrs/week
      </div>
    </div>
    <button
      onClick={() => removeSubject(index)}
      className={`px-3 py-1 rounded-md text-sm font-medium ${
        theme.dangerButton
      } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        theme.cardBg === "bg-gray-800"
          ? "focus:ring-offset-gray-800"
          : "focus:ring-offset-white"
      }`}
    >
      Remove
    </button>
  </li>
);

const TimetableGenerator = () => {
  // First declare ALL hooks unconditionally at the top level
  const [darkMode, setDarkMode] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [startTimePeriod, setStartTimePeriod] = useState("");
  const [endTimePeriod, setEndTimePeriod] = useState("");
  const [endTime, setEndTime] = useState("22:00");
  const [subjectName, setSubjectName] = useState("");
  const [table, setTable] = useState([]);
  const [weeklyHours, setWeeklyHours] = useState(4);
  const [selectedDay, setSelectedDay] = useState("");
  const [generate, setGenerate] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);

  const tableRef = useRef(null);
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Initialize dark mode after mount to prevent hydration errors
  useEffect(() => {
    setHasMounted(true);
    const isDark =
      localStorage.getItem("darkMode") === "true" ||
      (typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
  }, []);

  // Authentication check
  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Return empty div during SSR to prevent hydration mismatch
  if (!hasMounted) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900"></div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Constants
  const dayLabels = useMemo(
    () => ({
      mon: "Monday",
      tue: "Tuesday",
      wed: "Wednesday",
      thu: "Thursday",
      fri: "Friday",
      sat: "Saturday",
      sun: "Sunday",
    }),
    []
  );

  const colors = useMemo(
    () => [
      "#3B82F6",
      "#EF4444",
      "#10B981",
      "#F59E0B",
      "#8B5CF6",
      "#EC4899",
      "#14B8A6",
      "#F97316",
      "#6366F1",
      "#D946EF",
    ],
    []
  );

  // Memoized theme - now safe to use since we've mounted
  const theme = useMemo(
    () => ({
      bg: darkMode ? "bg-gray-900" : "bg-gray-50",
      cardBg: darkMode ? "bg-gray-800" : "bg-white",
      text: darkMode ? "text-gray-100" : "text-gray-800",
      secondaryText: darkMode ? "text-gray-400" : "text-gray-500",
      border: darkMode ? "border-gray-700" : "border-gray-200",
      inputBg: darkMode ? "bg-gray-700" : "bg-white",
      inputBorder: darkMode ? "border-gray-600" : "border-gray-300",
      primaryButton: darkMode
        ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
        : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-400",
      dangerButton: darkMode
        ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
        : "bg-red-500 hover:bg-red-600 focus:ring-red-400",
      successButton: darkMode
        ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
        : "bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-400",
      disabledButton: darkMode ? "bg-gray-700" : "bg-gray-300",
      accent: darkMode ? "ring-blue-500" : "ring-blue-400",
    }),
    [darkMode]
  );

  // Helper functions
  const toggleDarkMode = useCallback(() => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
  }, [darkMode]);

  const handleStartTime = useCallback((e) => {
    const timeValue = e.target.value;
    setStartTime(timeValue);

    if (timeValue) {
      const [hours, minutes] = timeValue.split(":");
      const hourNumber = parseInt(hours, 10);

      let period = "AM";
      let displayHour = hourNumber;

      if (hourNumber >= 12) {
        period = "PM";
        if (hourNumber > 12) {
          displayHour = hourNumber - 12;
        }
      } else if (hourNumber === 0) {
        displayHour = 12;
      }

      setStartTimePeriod(`${displayHour}:${minutes} ${period}`);
    } else {
      setStartTimePeriod("");
    }
  }, []);

  const handleEndTime = useCallback((e) => {
    const timeValue = e.target.value;
    setEndTime(timeValue);

    if (timeValue) {
      const [hours, minutes] = timeValue.split(":");
      const hourNumber = parseInt(hours, 10);

      let period = "AM";
      let displayHour = hourNumber;

      if (hourNumber >= 12) {
        period = "PM";
        if (hourNumber > 12) {
          displayHour = hourNumber - 12;
        }
      } else if (hourNumber === 0) {
        displayHour = 12;
      }

      setEndTimePeriod(`${displayHour}:${minutes} ${period}`);
    } else {
      setEndTimePeriod("");
    }
  }, []);

  const addSubject = useCallback(() => {
    if (!subjectName.trim()) {
      alert("Please enter a subject name");
      return;
    }

    if (!selectedDay) {
      alert("Please select a day for study");
      return;
    }

    const newSubject = {
      name: subjectName,
      duration: `${startTimePeriod} - ${endTimePeriod}`,
      weeklyHours,
      days: [selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)],
      color: colors[subjects.length % colors.length],
    };

    setSubjects([...subjects, newSubject]);
    setSubjectName("");
    setWeeklyHours(4);
    setSelectedDay("");
  }, [
    subjectName,
    selectedDay,
    startTimePeriod,
    endTimePeriod,
    weeklyHours,
    subjects.length,
    colors,
  ]);

  const removeSubject = useCallback((index) => {
    setSubjects((prev) => prev.filter((_, i) => i !== index));
  }, []);

  function convertToClassSchedule(courses) {
    const dayMap = {
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
      Sun: "Sunday",
    };

    const classSchedule = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };

    let courseCredits = [];

    courses.forEach((course) => {
      const [startTimeStr, endTimeStr] = course.duration
        .split(" - ")
        .map((s) => s.trim());

      const startTime = convertTo24HourFormat(startTimeStr);
      const endTime = convertTo24HourFormat(endTimeStr);
      courseCredits.push({
        course: course.name,
        credit_hours: course.weeklyHours,
      });

      course.days.forEach((day) => {
        const fullDayName = dayMap[day];
        if (fullDayName) {
          classSchedule[fullDayName].push({
            course: course.name,
            startTime,
            endTime,
          });
        }
      });
    });

    return { classSchedule, courseCredits };
  }

  function convertTo24HourFormat(timeStr) {
    const timePart = timeStr.replace(/[AP]M/, "").trim();
    const period = timeStr.includes("PM") ? "PM" : "AM";

    let [hours, minutes] = timePart.split(":").map(Number);

    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${(minutes || 0)
      .toString()
      .padStart(2, "0")}`;
  }

  const handleGenerateTimetable = useCallback(() => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGenerationComplete(false);

    const inputCourses = subjects;
    const { classSchedule, courseCredits } =
      convertToClassSchedule(inputCourses);
    setGenerate(true);

    const timetable = generateTimetable(courseCredits, classSchedule);
    setTable([...table, ...timetable.timetable]);

    setTimeout(() => {
      setIsGenerating(false);
      setGenerationComplete(true);
    }, 15000);
  }, [isGenerating, subjects, table]);

  return (
    <div
      className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-200`}
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1
              className={`text-3xl font-bold inline-block px-3 py-1 ${theme.text} rounded-lg`}
            >
              Study Plan Generator
            </h1>
            <p className={`${theme.secondaryText} mt-1`}>
              Plan your perfect study schedule
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`${theme.text}`}>
              Welcome, {user?.name || "User"}
            </span>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode
                  ? "bg-gray-700 text-amber-300"
                  : "bg-gray-200 text-gray-700"
              }`}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            className={`${theme.cardBg} p-6 rounded-xl shadow-lg ${theme.border} border transition-all duration-200`}
          >
            <h2 className="text-2xl font-semibold mb-6 text-blue-500">
              Create Your Schedule
            </h2>

            <div className="space-y-5">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${theme.text}`}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 ${theme.accent}`}
                  placeholder="Enter your name"
                />
              </div>

              <div
                className="bg-opacity-50 rounded-lg p-4"
                style={{
                  backgroundColor: darkMode
                    ? "rgba(31, 41, 55, 0.5)"
                    : "rgba(243, 244, 246, 0.5)",
                }}
              >
                <h3 className="text-lg font-semibold mb-3">Add New Subject</h3>

                <div className="mb-4">
                  <label
                    className={`block text-sm font-medium mb-1 ${theme.text}`}
                  >
                    Subject Name
                  </label>
                  <input
                    type="text"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 ${theme.accent}`}
                    placeholder="e.g., Mathematics"
                  />
                </div>

                <div className="mb-4">
                  <label
                    className={`block text-sm font-medium mb-2 ${theme.text}`}
                  >
                    Class Days
                  </label>
                  <DaySelection
                    dayLabels={dayLabels}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                    theme={theme}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className={`block text-sm font-medium mb-1 ${theme.text}`}
                  >
                    Credit Hours Per Week
                  </label>
                  <input
                    type="number"
                    value={weeklyHours}
                    onChange={(e) =>
                      setWeeklyHours(parseInt(e.target.value) || 0)
                    }
                    className={`w-full px-4 py-2 rounded-lg border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 ${theme.accent}`}
                    min="1"
                    max="40"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${theme.text}`}
                    >
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={handleStartTime}
                      className={`w-full px-4 py-2 rounded-lg border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 ${theme.accent}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${theme.text}`}
                    >
                      End Time
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={handleEndTime}
                      className={`w-full px-4 py-2 rounded-lg border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 ${theme.accent}`}
                    />
                  </div>
                </div>

                <button
                  onClick={addSubject}
                  className={`w-full text-white px-4 py-3 rounded-lg font-medium transition-colors ${
                    theme.primaryButton
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    darkMode
                      ? "focus:ring-offset-gray-800"
                      : "focus:ring-offset-white"
                  }`}
                >
                  Add Subject
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Your Subjects ({subjects.length})
                </h3>
                {subjects.length === 0 ? (
                  <div
                    className={`text-center py-6 rounded-lg ${theme.border} border-dashed ${theme.secondaryText}`}
                  >
                    No subjects added yet
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {subjects.map((subject, index) => (
                      <SubjectItem
                        key={index}
                        subject={subject}
                        index={index}
                        removeSubject={removeSubject}
                        theme={theme}
                      />
                    ))}
                  </ul>
                )}
              </div>

              <button
                onClick={handleGenerateTimetable}
                disabled={subjects.length === 0 || isGenerating}
                className={`w-full text-white px-4 py-3 rounded-lg font-medium transition-colors ${
                  subjects.length === 0 || isGenerating
                    ? `${theme.disabledButton} cursor-not-allowed`
                    : `${
                        theme.successButton
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        darkMode
                          ? "focus:ring-offset-gray-800"
                          : "focus:ring-offset-white"
                      }`
                }`}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  "Generate Timetable"
                )}
              </button>
            </div>
          </div>

          <div
            className={`${theme.cardBg} p-6 rounded-xl shadow-lg ${theme.border} border transition-all duration-200`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-blue-500">
                Your Timetable
              </h2>
              {generate && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    darkMode
                      ? "bg-emerald-900 text-emerald-200"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  Ready
                </span>
              )}
            </div>

            {generate ? (
              <div className="overflow-auto">
                <TimetablePDF data={table} name={name} darkMode={darkMode} />
              </div>
            ) : (
              <div
                className={`flex flex-col items-center justify-center py-12 rounded-lg ${theme.border} border-dashed ${theme.secondaryText}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mb-3 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-center max-w-xs">
                  {subjects.length > 0
                    ? "Click 'Generate Timetable' to create your schedule"
                    : "Add subjects to generate your timetable"}
                </p>
              </div>
            )}
            <Link
              href="/home/dashboard"
              className="px-6 py-3 backdrop-blur-sm bg-white/30 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700 rounded-lg shadow-lg hover:bg-white/40 dark:hover:bg-gray-700/60 transition-all font-medium text-gray-900 dark:text-white"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableGenerator;
