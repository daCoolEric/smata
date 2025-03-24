"use client"; // Mark this component as a Client Component

import { useRef } from "react";
import html2canvas from "html2canvas";
import dynamic from "next/dynamic";

// Dynamically load jsPDF on the client side
useEffect(() => {
    if (typeof window !== "undefined") {
      import("jspdf").then((module) => {
        setJsPDF(module.default);
      });
    }
  }, []);

  const downloadPDF = () => {
    if (!jsPDF) {
      alert("jsPDF is not loaded yet. Please try again.");
      return;
    }
const TableToPDF = () => {
  const tableRef = useRef<HTMLTableElement>(null);

  const downloadPDF = () => {
    const input = tableRef.current;
    if (!input) return;

    // Use html2canvas to capture the table as an image
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // Initialize jsPDF only if it's available (client-side)
      if (typeof window !== "undefined") {
        const pdf = new jsPDF("p", "mm", "a4"); // Create a new PDF in portrait mode, A4 size

        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate height to maintain aspect ratio

        // Add the image to the PDF
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("table.pdf"); // Download the PDF
      }
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Table to PDF</h1>

      {/* Table to be converted to PDF */}
      <table
        ref={tableRef}
        className="w-full border-collapse border border-gray-300"
      >
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Age</th>
            <th className="p-2 border">Occupation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border">John Doe</td>
            <td className="p-2 border">28</td>
            <td className="p-2 border">Software Engineer</td>
          </tr>
          <tr>
            <td className="p-2 border">Jane Smith</td>
            <td className="p-2 border">34</td>
            <td className="p-2 border">Data Scientist</td>
          </tr>
          <tr>
            <td className="p-2 border">Mike Johnson</td>
            <td className="p-2 border">45</td>
            <td className="p-2 border">Product Manager</td>
          </tr>
        </tbody>
      </table>

      {/* Button to download PDF */}
      <button
        onClick={downloadPDF}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Download PDF
      </button>
    </div>
  );
};

export default TableToPDF;
