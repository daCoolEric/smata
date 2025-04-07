"use client";
import React, { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function TimetablePDF({ data, name, darkMode }) {
  const [canDownload, setCanDownload] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [adCountdown, setAdCountdown] = useState(15); // 15-second ad
  const [adWatched, setAdWatched] = useState(false);
  const tableRef = useRef(null);

  // Generation progress timer
  useEffect(() => {
    let timer;
    if (generationProgress < 100) {
      timer = setTimeout(() => {
        setGenerationProgress(generationProgress + 100 / 15); // Complete in 15 seconds
      }, 1000);
    } else {
      setShowGenerateButton(true);
    }
    return () => clearTimeout(timer);
  }, [generationProgress]);

  // const progressTimer = () => {
  //   let timer;
  //   if (generationProgress < 100) {
  //     timer = setTimeout(() => {
  //       setGenerationProgress(generationProgress + 100 / 15); // Complete in 15 seconds
  //     }, 1000);
  //   } else {
  //     setShowGenerateButton(true);
  //   }
  //   return () => clearTimeout(timer);
  // }
  // Countdown timer for the ad
  useEffect(() => {
    let timer;
    if (showAd && adCountdown > 0) {
      timer = setTimeout(() => {
        setAdCountdown(adCountdown - 1);
      }, 1000);
    } else if (showAd && adCountdown === 0) {
      setAdWatched(true);
    }
    return () => clearTimeout(timer);
  }, [showAd, adCountdown]);

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

  const handleGenerateTable = () => {
    setShowAd(true);
    setCanDownload(true); // Automatically enable download after ad is watched
  };

  const handleDownload = async () => {
    if (!canDownload) {
      alert("Please watch the ad to access the timetable");
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

  const handleSkipAd = () => {
    alert("You must watch the full ad to access the timetable");
  };

  const handleContinueAfterAd = () => {
    setShowAd(false);
    setShowTable(true);
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
    progressContainer: {
      textAlign: "center",
      margin: "40px 0",
    },
    progressBar: {
      width: "100%",
      height: "20px",
      backgroundColor: darkMode ? "#2d3748" : "#e2e8f0",
      borderRadius: "10px",
      margin: "20px 0",
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: darkMode ? "#38a169" : "#4CAF50",
      width: `${generationProgress}%`,
      transition: "width 1s linear",
    },
    generateButton: {
      padding: "12px 24px",
      backgroundColor: darkMode ? "#3182ce" : "#2196F3",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "bold",
      margin: "20px auto",
      display: "block",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      ":hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
      },
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
    adContainer: {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: darkMode ? "#1a202c" : "#ffffff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "1000",
      padding: "20px",
      textAlign: "center",
    },
    adContent: {
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      border: darkMode ? "1px solid #4a5568" : "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: darkMode ? "#2d3748" : "#f8f8f8",
    },
    countdown: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: darkMode ? "#38a169" : "#4CAF50",
      margin: "20px 0",
    },
    adButton: {
      padding: "10px 20px",
      margin: "10px",
      borderRadius: "4px",
      cursor: "pointer",
      border: "none",
      fontWeight: "bold",
    },
    downloadButton: {
      padding: "12px 24px",
      marginTop: "20px",
      borderRadius: "4px",
      backgroundColor: darkMode ? "#3182ce" : "#2196F3",
      color: "white",
      border: "none",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "bold",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      ":hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
      },
    },
  };

  return (
    <div style={styles.container}>
      {/* Study plan generation progress */}
      {!showGenerateButton && !showAd && !showTable && (
        <div style={styles.progressContainer}>
          <h2>Generating Your Personalized Study Plan</h2>
          <p>Analyzing your courses and optimizing your schedule...</p>
          <div style={styles.progressBar}>
            <div style={styles.progressFill}></div>
          </div>
          <p>{Math.min(100, Math.round(generationProgress))}% Complete</p>
        </div>
      )}

      {/* Generate button - appears after generation completes */}
      {showGenerateButton && !showAd && !showTable && (
        <button onClick={handleGenerateTable} style={styles.generateButton}>
          Generate Timetable (Watch Ad to Continue)
        </button>
      )}

      {/* Ad overlay - appears after generate button is clicked */}
      {showAd && (
        <div style={styles.adContainer}>
          <div style={styles.adContent}>
            <h2>Advertisement</h2>
            <p>Please watch this short ad to view your timetable</p>

            {/* Simulated ad content */}
            <div
              style={{
                width: "100%",
                height: "300px",
                backgroundColor: "#333",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "20px 0",
                borderRadius: "4px",
              }}
            >
              <p>Sponsored Content ({adCountdown}s remaining)</p>
            </div>

            <div style={styles.countdown}>
              {adCountdown > 0
                ? `${adCountdown} seconds remaining`
                : "Ad complete!"}
            </div>

            {adWatched ? (
              <button
                onClick={handleContinueAfterAd}
                style={{
                  ...styles.adButton,
                  backgroundColor: darkMode ? "#38a169" : "#4CAF50",
                  color: "white",
                }}
              >
                View Timetable
              </button>
            ) : (
              <button
                onClick={handleSkipAd}
                style={{
                  ...styles.adButton,
                  backgroundColor: darkMode ? "#e53e3e" : "#f44336",
                  color: "white",
                }}
              >
                Skip Ad (Not Allowed)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table content - shown after ad is watched */}
      {showTable && (
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
                    borderTop: darkMode
                      ? "2px solid #4a5568"
                      : "2px solid #ddd",
                  }}
                >
                  © {new Date().getFullYear()} Grinbox™ - All Rights Reserved
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Download button - shown only when table is visible */}
      {showTable && (
        <button onClick={handleDownload} style={styles.downloadButton}>
          Download Timetable (PDF)
        </button>
      )}
    </div>
  );
}
