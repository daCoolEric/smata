"use client";
import { useState, useRef } from "react";
import { generateTimetable } from "./logic/generateTimetable";
import TimetablePDF from "./components/TimetablePDF";

const TimetableGenerator = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [startTimePeriod, setStartTimePeriod] = useState("");
  const [endTimePeriod, setEndTimePeriod] = useState("");
  const [endTime, setEndTime] = useState("22:00");
  const [subjectName, setSubjectName] = useState("");
  const [table, setTable] = useState([]);
  const [weeklyHours, setWeeklyHours] = useState(4);
  const [selectedDay, setSelectedDay] = useState("");
  const dayLabels = {
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday",
  };
  const [subjects, setSubjects] = useState([]);

  const colors = [
    "#3498db",
    "#e74c3c",
    "#2ecc71",
    "#f39c12",
    "#9b59b6",
    "#1abc9c",
    "#d35400",
    "#34495e",
    "#16a085",
    "#c0392b",
    "#27ae60",
    "#8e44ad",
    "#2980b9",
    "#f1c40f",
    "#e67e22",
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleStartTime = (e) => {
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
  };

  const handleEndTime = (e) => {
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
  };

  const addSubject = () => {
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
  };

  const removeSubject = (index) => {
    const newSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(newSubjects);
  };

  const tableRef = useRef(null);

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

  const handleGenerateTimetable = () => {
    const inputCourses = subjects;
    const { classSchedule, courseCredits } =
      convertToClassSchedule(inputCourses);

    console.log("Class Schedule:", classSchedule);
    console.log("Course Credits:", courseCredits);

    const timetable = generateTimetable(courseCredits, classSchedule);
    console.log("Generated Timetable:", timetable);
    setTable([...table, ...timetable.timetable]);
  };

  // Dark mode classes
  const bgColor = darkMode ? "bg-gray-900" : "bg-white";
  const textColor = darkMode ? "text-gray-100" : "text-gray-800";
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-200";
  const inputBg = darkMode ? "bg-gray-700 text-white" : "bg-white";
  const buttonPrimary = darkMode
    ? "bg-blue-600 hover:bg-blue-700"
    : "bg-blue-500 hover:bg-blue-600";
  const buttonDanger = darkMode
    ? "bg-red-600 hover:bg-red-700"
    : "bg-red-500 hover:bg-red-600";
  const buttonSuccess = darkMode
    ? "bg-green-600 hover:bg-green-700"
    : "bg-green-500 hover:bg-green-600";

  return (
    <div
      className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}
    >
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Study Timetable Generator</h1>
          <button
            onClick={toggleDarkMode}
            className={`px-3 py-1 rounded-md ${
              darkMode
                ? "bg-gray-700 text-yellow-300"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          <div
            className={`flex-1 min-w-[300px] ${cardBg} p-6 rounded-lg shadow-md ${borderColor} border`}
          >
            <h2 className="text-xl font-semibold mb-4">
              Setup Your Study Plan
            </h2>

            <div className="mb-4">
              <label className="block font-medium mb-1">Your Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-2 border rounded ${borderColor} ${inputBg}`}
                placeholder="Enter your name"
              />
            </div>

            <h3 className="text-lg font-semibold mb-2">
              Add Subjects on your class Schedule
            </h3>
            <div className="mb-4">
              <label className="block font-medium mb-1">Study Days:</label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(dayLabels).map((day) => (
                  <div key={day} className="flex items-center gap-1">
                    <input
                      type="radio"
                      id={`day-${day}`}
                      name="day-selection"
                      checked={selectedDay === day}
                      onChange={() => setSelectedDay(day)}
                      className={darkMode ? "accent-blue-400" : ""}
                    />
                    <label htmlFor={`day-${day}`}>{dayLabels[day]}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Subject Name:</label>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className={`w-full p-2 border rounded ${borderColor} ${inputBg}`}
                placeholder="e.g., Mathematics"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">
                Credit Hours Per Week:
              </label>
              <input
                type="number"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(parseInt(e.target.value))}
                className={`w-full p-2 border rounded ${borderColor} ${inputBg}`}
                min="1"
                max="40"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Start Time:</label>
              <input
                type="time"
                value={startTime}
                onChange={handleStartTime}
                className={`w-full p-2 border rounded ${borderColor} ${inputBg}`}
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">End Time:</label>
              <input
                type="time"
                value={endTime}
                onChange={handleEndTime}
                className={`w-full p-2 border rounded ${borderColor} ${inputBg}`}
              />
            </div>

            <button
              onClick={addSubject}
              className={`text-white px-4 py-2 rounded ${buttonPrimary}`}
            >
              Add Subject
            </button>

            <div className="mt-4">
              {subjects.map((subject, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 mb-2 border-l-4 ${borderColor}`}
                  style={{ borderColor: subject.color }}
                >
                  <div>
                    <strong>{subject.name}</strong> ({subject.weeklyHours}{" "}
                    credit hours)
                    <br />
                    {subject.duration} on {subject.days.join(", ")}
                  </div>
                  <button
                    onClick={() => removeSubject(index)}
                    className={`text-white px-2 py-1 rounded ${buttonDanger}`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleGenerateTimetable}
              className={`text-white px-4 py-2 rounded ${buttonSuccess} mt-4`}
            >
              Generate Timetable
            </button>
          </div>

          <div
            className={`flex-2 min-w-[500px] ${cardBg} p-6 rounded-lg shadow-md ${borderColor} border`}
          >
            <h2 className="text-xl font-semibold mb-4">Your Study Timetable</h2>
            <TimetablePDF data={table} name={name} darkMode={darkMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableGenerator;
