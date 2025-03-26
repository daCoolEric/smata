"use client";
import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { PDFDocument, rgb } from "pdf-lib";

const TimetableGenerator = () => {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [startTimePeriod, setStartTimePeriod] = useState("");
  const [endTimePeriod, setEndTimePeriod] = useState("");
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
    duration: string;
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
  const handleStartTime = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        displayHour = 12; // Midnight (12 AM)
      }

      setStartTimePeriod(`${displayHour}:${minutes} ${period}`);
    } else {
      setStartTimePeriod("");
    }
  };

  const handleEndTime = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        displayHour = 12; // Midnight (12 AM)
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

    const newSubject: Subject = {
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

  const removeSubject = (index: number) => {
    const newSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(newSubjects);
  };

  const tableRef = useRef<HTMLTableElement>(null);

  const generateTimetable = () => {
    // Implement timetable generation logic here
    console.log(subjects);
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

          {/* <div className="mb-4">
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
          </div> */}

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
