import { useState } from "react";

export default function FileUploader({ onFileUpload }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Check file type
    const validTypes = [
      "application/pdf",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
      "application/vnd.ms-powerpoint", // Legacy PPT
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
    ];

    if (!validTypes.includes(file.type)) {
      alert("Please upload a PDF, PPT, PPTX, or DOCX file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onFileUpload(file, e.target.result);
    };

    // Read as ArrayBuffer for binary files (PDF, DOCX, PPT, PPTX)
    if (
      file.type === "application/pdf" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/vnd.ms-powerpoint" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      reader.readAsArrayBuffer(file);
    }
    // Read as text for plain text files
    else {
      reader.readAsText(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed p-10 text-center rounded-lg cursor-pointer transition-colors ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("fileInput").click()}
    >
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept=".pdf,.txt,.docx"
        onChange={handleFileInput}
      />
      <p className="text-lg mb-2">
        Drag and drop your course notes or click to upload
      </p>
      <p className="text-sm text-gray-500">Supports PDF, PPT, and DOCX files</p>
    </div>
  );
}
