"use client";
import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function TimetablePDF({ data, name, darkMode }) {
  const [canDownload, setCanDownload] = useState(false);
  const tableRef = useRef(null);

  // Group data by day and time slot
  const groupedData = data.reduce((acc, session) => {
    if (!acc[session.day]) {
      acc[session.day] = {};
    }
    if (!acc[session.day][session.timeSlot]) {
      acc[session.day][session.timeSlot] = [];
    }
    acc[session.day][session.timeSlot].push(session);
    return acc;
  }, {});

  const handleDownload = async () => {
    if (!canDownload) {
      alert("Please agree to terms first");
      return;
    }

    try {
      const tableClone = tableRef.current.cloneNode(true);

      // Apply PDF-safe styling based on dark mode
      tableClone.style.width = "100%";
      tableClone.style.borderCollapse = "collapse";
      tableClone.style.backgroundColor = darkMode ? "#1a202c" : "#ffffff";
      tableClone.style.color = darkMode ? "#e2e8f0" : "#1a202c";

      // Style th elements
      const thElements = tableClone.querySelectorAll("th");
      thElements.forEach((th) => {
        th.style.backgroundColor = darkMode ? "#2d3748" : "#f2f2f2";
        th.style.border = darkMode ? "1px solid #4a5568" : "1px solid #ddd";
        th.style.padding = "12px";
        th.style.textAlign = "left";
        th.style.color = darkMode ? "#e2e8f0" : "#1a202c";
      });

      // Style td elements
      const tdElements = tableClone.querySelectorAll("td");
      tdElements.forEach((td) => {
        td.style.border = darkMode ? "1px solid #4a5568" : "1px solid #ddd";
        td.style.padding = "8px";
        td.style.color = darkMode ? "#e2e8f0" : "#1a202c";
      });

      document.body.appendChild(tableClone);

      const doc = new jsPDF("p", "mm", "a4");
      const canvas = await html2canvas(tableClone, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: darkMode ? "#1a202c" : "#ffffff",
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

  // Dynamic styles based on dark mode
  const styles = {
    container: {
      position: "relative",
      width: "100%",
      maxWidth: "800px",
      margin: "2rem auto",
      color: darkMode ? "#e2e8f0" : "#1a202c",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px",
      backgroundColor: darkMode ? "#1a202c" : "#ffffff",
      color: darkMode ? "#e2e8f0" : "#1a202c",
    },
    headerCell: {
      border: darkMode ? "1px solid #4a5568" : "1px solid #ddd",
      padding: "12px",
      textAlign: "center",
      backgroundColor: darkMode ? "#2d3748" : "#f2f2f2",
      color: darkMode ? "#e2e8f0" : "#1a202c",
    },
    cell: {
      border: darkMode ? "1px solid #4a5568" : "1px solid #ddd",
      padding: "8px",
    },
    timeSlotCell: {
      verticalAlign: "top",
      fontWeight: "500",
    },
    overlay: {
      position: "absolute",
      inset: "0",
      backdropFilter: "blur(4px)",
      backgroundColor: darkMode
        ? "rgba(26, 32, 44, 0.9)"
        : "rgba(255,255,255,0.9)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "16px",
      color: darkMode ? "#e2e8f0" : "#1a202c",
    },
    agreeButton: {
      padding: "10px 20px",
      backgroundColor: darkMode ? "#38a169" : "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    downloadButton: {
      padding: "10px 20px",
      marginTop: "20px",
      borderRadius: "4px",
      transition: "background-color 0.3s",
      ...(canDownload
        ? {
            backgroundColor: darkMode ? "#3182ce" : "#2196F3",
            color: "white",
            cursor: "pointer",
          }
        : {
            backgroundColor: darkMode ? "#4a5568" : "#e0e0e0",
            color: darkMode ? "#a0aec0" : "#9e9e9e",
            cursor: "not-allowed",
          }),
    },
  };

  return (
    <div style={styles.container}>
      <div style={{ position: "relative" }}>
        <table ref={tableRef} style={styles.table}>
          <thead>
            <tr>
              <th colSpan={4} style={styles.headerCell}>
                Personal Study Timetable for{" "}
                <span style={{ fontWeight: "600" }}>{name || "Student"}</span>
              </th>
            </tr>
            <tr>
              <th style={styles.headerCell}>Day</th>
              <th style={styles.headerCell}>Time Slot</th>
              <th style={styles.headerCell}>Course</th>
              <th style={styles.headerCell}>Duration</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedData).map(([day, timeSlots]) => {
              const timeSlotKeys = Object.keys(timeSlots);
              const totalRows = timeSlotKeys.reduce(
                (sum, slot) => sum + timeSlots[slot].length,
                0
              );

              return (
                <React.Fragment key={day}>
                  {timeSlotKeys.map((timeSlot) => (
                    <React.Fragment key={`${day}-${timeSlot}`}>
                      {timeSlots[timeSlot].map((session, index) => (
                        <tr key={`${day}-${timeSlot}-${index}`}>
                          {index === 0 && timeSlot === timeSlotKeys[0] && (
                            <td
                              rowSpan={totalRows}
                              style={{
                                ...styles.cell,
                                ...styles.timeSlotCell,
                              }}
                            >
                              {day}
                            </td>
                          )}
                          {index === 0 && (
                            <td
                              rowSpan={timeSlots[timeSlot].length}
                              style={styles.cell}
                            >
                              {timeSlot}
                            </td>
                          )}
                          <td style={styles.cell}>{session.course}</td>
                          <td style={styles.cell}>{session.time}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              );
            })}

            <tr>
              <th
                colSpan={4}
                style={{
                  ...styles.cell,
                  textAlign: "center",
                  fontSize: "0.8rem",
                  padding: "12px",
                  borderTop: darkMode ? "2px solid #4a5568" : "2px solid #ddd",
                }}
              >
                © {new Date().getFullYear()} Grinbox™ - All Rights Reserved
              </th>
            </tr>
          </tbody>
        </table>

        {!canDownload && (
          <div style={styles.overlay}>
            <p style={{ fontWeight: "bold", fontSize: "1.125rem" }}>
              Complete the requirements to download
            </p>
            <button
              onClick={() => setCanDownload(true)}
              style={styles.agreeButton}
            >
              I agree to terms
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleDownload}
        disabled={!canDownload}
        style={styles.downloadButton}
      >
        Download Timetable (PDF)
      </button>
    </div>
  );
}
