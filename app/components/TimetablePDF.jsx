"use client";
import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function TimetablePDF({ data, name }) {
  const [canDownload, setCanDownload] = useState(false);
  const tableRef = useRef(null);

  // Group data by day
  const groupedData = data.reduce((acc, session) => {
    if (!acc[session.day]) {
      acc[session.day] = [];
    }
    acc[session.day].push(session);
    return acc;
  }, {});

  const handleDownload = async () => {
    if (!canDownload) {
      alert("Please agree to terms first");
      return;
    }

    try {
      // Create a clone with simplified styling
      const tableClone = tableRef.current.cloneNode(true);

      // Apply PDF-safe styling directly
      tableClone.style.width = "100%";
      tableClone.style.borderCollapse = "collapse";

      // Style th elements
      const thElements = tableClone.querySelectorAll("th");
      thElements.forEach((th) => {
        th.style.backgroundColor = "#f2f2f2";
        th.style.border = "1px solid #ddd";
        th.style.padding = "12px";
        th.style.textAlign = "left";
      });

      // Style td elements
      const tdElements = tableClone.querySelectorAll("td");
      tdElements.forEach((td) => {
        td.style.border = "1px solid #ddd";
        td.style.padding = "8px";
      });

      document.body.appendChild(tableClone);

      const doc = new jsPDF("p", "mm", "a4");
      const canvas = await html2canvas(tableClone, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = doc.internal.pageSize.getWidth() - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      doc.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      doc.save("timetable.pdf");

      document.body.removeChild(tableClone);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "800px",
        margin: "2rem auto",
      }}
    >
      <div style={{ position: "relative" }}>
        <table
          ref={tableRef}
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr>
              <th
                colSpan={4}
                className="border border-gray-300 p-3 text-center mb-4"
              >
                Personal Study Timetable for{" "}
                <span className="font-semibold">{name || "Student"}</span>
              </th>
            </tr>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "left",
                }}
              >
                Day
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "left",
                }}
              >
                Time Slot
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "left",
                }}
              >
                Course
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "left",
                }}
              >
                Duration
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedData).map(([day, sessions]) => (
              <React.Fragment key={day}>
                {sessions.map((session, index) => (
                  <tr key={`${day}-${index}`}>
                    {index === 0 && (
                      <td
                        rowSpan={sessions.length}
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          fontWeight: "500",
                        }}
                      >
                        {day}
                      </td>
                    )}
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {session.timeSlot}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {session.course}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {session.time}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {!canDownload && (
          <div
            style={{
              position: "absolute",
              inset: "0",
              backdropFilter: "blur(4px)",
              backgroundColor: "rgba(255,255,255,0.7)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            <p style={{ fontWeight: "bold", fontSize: "1.125rem" }}>
              Complete the requirements to download
            </p>
            <button
              onClick={() => setCanDownload(true)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              I agree to terms
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleDownload}
        disabled={!canDownload}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          borderRadius: "4px",
          transition: "background-color 0.3s",
          ...(canDownload
            ? {
                backgroundColor: "#2196F3",
                color: "white",
                cursor: "pointer",
              }
            : {
                backgroundColor: "#e0e0e0",
                color: "#9e9e9e",
                cursor: "not-allowed",
              }),
        }}
      >
        Download Timetable (PDF)
      </button>
    </div>
  );
}
