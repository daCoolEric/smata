"use client";
import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { PDFDocument, rgb } from "pdf-lib";
import { generateTimetable } from "./logic/generateTimetable";
import TimetablePDF from "./components/TimetablePDF";

const TimetableGenerator = () => {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [startTimePeriod, setStartTimePeriod] = useState("");
  const [endTimePeriod, setEndTimePeriod] = useState("");
  const [endTime, setEndTime] = useState("22:00");
  const [subjectName, setSubjectName] = useState("");
  const [table, setTable] = useState([]);
  const [weeklyHours, setWeeklyHours] = useState(4);
  const [days, setDays] = useState({
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: false,
    sun: false,
  });
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

    const selectedDays = Object.keys(days)
      .filter((day) => days[day])
      .map((day) => day.charAt(0).toUpperCase() + day.slice(1));

    if (selectedDays.length === 0) {
      alert("Please select at least one day for study");
      return;
    }

    const newSubject = {
      name: subjectName,
      duration: `${startTimePeriod} - ${endTimePeriod} `,
      weeklyHours,
      days: selectedDays,
      color: colors[subjects.length % colors.length],
    };

    setSubjects([...subjects, newSubject]);
    setSubjectName("");
    setWeeklyHours(4);
  };

  const removeSubject = (index) => {
    const newSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(newSubjects);
  };

  const tableRef = useRef(null);

  // Helper functions outside the main function
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

  // Main function that uses the timetable generation logic
  const handleGenerateTimetable = () => {
    const inputCourses = subjects;
    const { classSchedule, courseCredits } =
      convertToClassSchedule(inputCourses);

    console.log("Class Schedule:", classSchedule);
    console.log("Course Credits:", courseCredits);

    // Call the actual timetable generator (imported from another file)
    const timetable = generateTimetable(courseCredits, classSchedule);
    console.log("Generated Timetable:", timetable);
    setTable([...table, ...timetable.timetable]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Study Timetable Generator</h1>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px] bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Setup Your Study Plan</h2>

          <div className="mb-4">
            <label className="block font-medium mb-1">Your Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your name"
            />
          </div>

          <h3 className="text-lg font-semibold mb-2">
            Add Subjects on your class Schedule
          </h3>
          <div className="mb-4">
            <label className="block font-medium mb-1">Study Days:</label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(days).map((day) => (
                <div key={day} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    id={`day-${day}`}
                    checked={days[day]}
                    onChange={(e) =>
                      setDays({ ...days, [day]: e.target.checked })
                    }
                  />
                  <label htmlFor={`day-${day}`}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </label>
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
              className="w-full p-2 border rounded"
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
              className="w-full p-2 border rounded"
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
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">End Time:</label>
            <input
              type="time"
              value={endTime}
              onChange={handleEndTime}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            onClick={addSubject}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Subject
          </button>

          <div className="mt-4">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 mb-2 border-l-4"
                style={{ borderColor: subject.color }}
              >
                <div>
                  <strong>{subject.name}</strong> ({subject.weeklyHours} credit
                  hours)
                  <br />
                  {subject.duration} on {subject.days.join(", ")}
                </div>
                <button
                  onClick={() => removeSubject(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerateTimetable}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
          >
            Generate Timetable
          </button>
        </div>

        <div className="flex-2 min-w-[500px] bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Study Timetable</h2>

          <TimetablePDF data={table} name={name} />

          {/* <button
            onClick={printTimetable}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
          >
            Print Timetable
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default TimetableGenerator;
