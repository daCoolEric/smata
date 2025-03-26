"use client";
import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { PDFDocument, rgb } from "pdf-lib";

const TimetableGenerator = () => {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("22:00");
  const [breakDuration, setBreakDuration] = useState(15);
  const [sessionDuration, setSessionDuration] = useState(45);
  const [subjectName, setSubjectName] = useState("");
  const [priority, setPriority] = useState("medium");
  const [weeklyHours, setWeeklyHours] = useState(4);
  const [days, setDays] = useState<{ [key: string]: boolean }>({
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: false,
    sun: false,
  });
  const [subjects, setSubjects] = useState<Subject[]>([]);

  interface Subject {
    name: string;
    priority: string;
    weeklyHours: number;
    days: string[];
    color: string;
  }

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

    const newSubject: Subject = {
      name: subjectName,
      priority,
      weeklyHours,
      days: selectedDays,
      color: colors[subjects.length % colors.length],
    };

    setSubjects([...subjects, newSubject]);
    setSubjectName("");
    setPriority("medium");
    setWeeklyHours(4);
  };

  const removeSubject = (index: number) => {
    const newSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(newSubjects);
  };

  const tableRef = useRef<HTMLTableElement>(null);

  const generateTimetable = () => {
    // Implement timetable generation logic here
    interface Course {
      name: string;
      duration: string;
      weeklyHours: number;
      days: string[];
      color: string;
    }

    interface ScheduleItem {
      course: string;
      startTime: string;
      endTime: string;
    }

    interface ClassSchedule {
      Monday: ScheduleItem[];
      Tuesday: ScheduleItem[];
      Wednesday: ScheduleItem[];
      Thursday: ScheduleItem[];
      Friday: ScheduleItem[];
      Saturday: ScheduleItem[];
      Sunday: ScheduleItem[];
    }

    function convertToClassSchedule(courses: Course[]): ClassSchedule {
      // Map of short day names to full day names
      const dayMap: Record<string, string> = {
        Mon: "Monday",
        Tue: "Tuesday",
        Wed: "Wednesday",
        Thu: "Thursday",
        Fri: "Friday",
        Sat: "Saturday",
        Sun: "Sunday",
      };

      // Initialize the schedule with all days
      const classSchedule: ClassSchedule = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
      };

      // Process each course
      courses.forEach((course: Course) => {
        // Extract start and end times from duration
        const [startTimeStr, endTimeStr] = course.duration
          .split(" - ")
          .map((s) => s.trim());

        // Convert time to 24-hour format without AM/PM
        const startTime = convertTo24HourFormat(startTimeStr);
        const endTime = convertTo24HourFormat(endTimeStr);

        // Add course to each of its scheduled days
        course.days.forEach((day: string) => {
          const fullDayName = dayMap[day];
          if (fullDayName) {
            classSchedule[fullDayName as keyof ClassSchedule].push({
              course: course.name,
              startTime,
              endTime,
            });
          }
        });
      });

      return classSchedule;
    }

    // Helper function to convert time to 24-hour format
    function convertTo24HourFormat(timeStr: string): string {
      // Remove AM/PM and any whitespace
      const timePart = timeStr.replace(/[AP]M/, "").trim();
      const period = timeStr.includes("PM") ? "PM" : "AM";

      let [hours, minutes] = timePart.split(":").map(Number);

      // Convert to 24-hour format
      if (period === "PM" && hours !== 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }

      // Format with leading zeros
      return `${hours.toString().padStart(2, "0")}:${(minutes || 0)
        .toString()
        .padStart(2, "0")}`;
    }

    // Example usage:
    const inputCourses: Course[] = [
      {
        name: "Religious, Moral and Social Values",
        duration: "10:00 AM - 12:00 PM ",
        weeklyHours: 3,
        days: ["Mon"],
        color: "#3498db",
      },
      {
        name: "Sociology",
        duration: "1:30 PM - 3:30 PM ",
        weeklyHours: 3,
        days: ["Mon"],
        color: "#e74c3c",
      },
      {
        name: "Computer Literacy",
        duration: "1:00 PM - 3:00 PM ",
        weeklyHours: 2,
        days: ["Tue"],
        color: "#2ecc71",
      },
      {
        name: "Professional Adjustment in Nursing",
        duration: "9:00 AM - 12:00 PM ",
        weeklyHours: 2,
        days: ["Wed"],
        color: "#f39c12",
      },
      {
        name: "Physics for Health Sciences",
        duration: "1:30 PM - 3:30 PM ",
        weeklyHours: 2,
        days: ["Wed"],
        color: "#9b59b6",
      },
      {
        name: "Introduction to French",
        duration: "1:00 PM - 3:00 PM ",
        weeklyHours: 2,
        days: ["Thu"],
        color: "#1abc9c",
      },
      {
        name: "Basic Statistics",
        duration: "9:00 AM - 11:00 AM ",
        weeklyHours: 2,
        days: ["Thu"],
        color: "#d35400",
      },
      {
        name: "Writing Skills I",
        duration: "9:00 AM - 12:00 PM ",
        weeklyHours: 3,
        days: ["Fri"],
        color: "#34495e",
      },
      {
        name: "Biological Chemistry",
        duration: "1:00 PM - 3:00 PM ",
        weeklyHours: 2,
        days: ["Fri"],
        color: "#16a085",
      },
    ];

    const classSchedule: ClassSchedule = convertToClassSchedule(inputCourses);
    console.log(classSchedule);
  };

  const printTimetable = async () => {
    // window.print();
    const input = tableRef.current;
    if (!input) return;

    try {
      // Use html2canvas to capture the table as an image
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");

      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([canvas.width, canvas.height]);

      // Embed the image in the PDF
      const pngImage = await pdfDoc.embedPng(imgData);
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height,
      });

      // Serialize the PDF to a Uint8Array
      const pdfBytes = await pdfDoc.save();

      // Create a Blob from the PDF bytes
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      // Create a download link for the PDF
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "table.pdf";
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF.");
    }
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

          <div className="mb-4">
            <label className="block font-medium mb-1">Daily Start Time:</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Daily End Time:</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">
              Break Duration (minutes):
            </label>
            <input
              type="number"
              value={breakDuration}
              onChange={(e) => setBreakDuration(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
              min="0"
              max="60"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">
              Study Session Duration (minutes):
            </label>
            <input
              type="number"
              value={sessionDuration}
              onChange={(e) => setSessionDuration(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
              min="15"
              max="180"
            />
          </div>

          <h3 className="text-lg font-semibold mb-2">Add Subjects</h3>
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
            <label className="block font-medium mb-1">Priority Level:</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

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
            <label className="block font-medium mb-1">Hours Per Week:</label>
            <input
              type="number"
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
              min="1"
              max="40"
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
                  <strong>{subject.name}</strong> ({subject.priority} priority)
                  <br />
                  {subject.weeklyHours} hours per week on{" "}
                  {subject.days.join(", ")}
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
            onClick={generateTimetable}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
          >
            Generate Timetable
          </button>
        </div>

        <div className="flex-2 min-w-[500px] bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Study Timetable</h2>
          <p className="mb-4">
            Personalized study plan for{" "}
            <span className="font-semibold">{name || "Student"}</span>
          </p>

          <div className="overflow-x-auto">
            <table ref={tableRef} className="w-full">
              <thead>
                <tr>
                  {["DAY", "REVISION", "NEW CONCEPTS"].map((header) => (
                    <th key={header} className="p-2 border">
                      {header}
                    </th>
                  ))}
                </tr>
                {[
                  "MONDAY",
                  "TUESDAY",
                  "WEDNESDAY",
                  "THURSDAY",
                  "FRIDAY",
                  "SATURDAY",
                  "SUNDAY",
                ].map((DAY) => (
                  <tr>
                    {[DAY, " ", " "].map((record) => (
                      <th key={record} className="p-2 border">
                        {record}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody></tbody>
            </table>
          </div>

          <button
            onClick={printTimetable}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
          >
            Print Timetable
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimetableGenerator;
