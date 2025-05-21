"use client";
import { useState, useEffect } from "react";
import mammoth from "mammoth";

export default function DocumentViewer({
  file,
  fileContent,
  onTextSelected,
  darkMode = false,
}) {
  const [documentText, setDocumentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    if (!file || !fileContent) return;

    const processFile = async () => {
      setLoading(true);
      setError(null);
      try {
        let text = "";

        if (file.type === "application/pdf") {
          text = await extractTextFromPDF(fileContent);
        } else if (
          file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          text = await extractTextFromDOCX(fileContent);
        } else if (
          file.type === "application/vnd.ms-powerpoint" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ) {
          text = await extractTextFromPPT(file);
        } else {
          null;
        }

        if (!text.trim()) {
          throw new Error(
            "No text content could be extracted from this document"
          );
        }

        setDocumentText(text);
      } catch (error) {
        console.error("File processing error:", error);
        setError(error.message);
        setDocumentText("");
      } finally {
        setLoading(false);
      }
    };

    processFile();
  }, [file, fileContent]);

  const extractTextFromPDF = async (pdfData) => {
    try {
      // Dynamically import PDF.js with compatible versions
      const pdfjsLib = await import("pdfjs-dist/build/pdf");
      const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry");

      // Set the worker path to use the imported worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

      // Convert fileContent to ArrayBuffer if needed
      const arrayBuffer =
        pdfData instanceof ArrayBuffer ? pdfData : await pdfData.arrayBuffer();

      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      let text = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent({
          normalizeWhitespace: false,
          disableCombineTextItems: false,
        });

        const textItemsByLine = {};

        content.items.forEach((item) => {
          const y = item.transform ? item.transform[5] : 0;
          if (!textItemsByLine[y]) {
            textItemsByLine[y] = [];
          }
          textItemsByLine[y].push(item);
        });

        const sortedLines = Object.keys(textItemsByLine)
          .sort((a, b) => b - a)
          .map((y) => textItemsByLine[y]);

        for (const line of sortedLines) {
          line.sort((a, b) => {
            const aX = a.transform ? a.transform[4] : 0;
            const bX = b.transform ? b.transform[4] : 0;
            return aX - bX;
          });

          let lineText = "";
          let lastX = 0;

          for (const item of line) {
            const itemX = item.transform ? item.transform[4] : 0;

            if (itemX - lastX > 5 && lastX !== 0) {
              lineText += " ";
            }

            lineText += item.str;
            lastX = itemX + (item.width || 0);
          }

          text += lineText + "\n";
        }

        if (i < pdf.numPages) {
          text += "\n";
        }
      }

      return text;
    } catch (error) {
      console.error("PDF extraction error:", error);
      if (error.message.includes("Invalid PDF")) {
        throw new Error("Invalid PDF file. The file may be corrupted.");
      } else if (error.message.includes("password")) {
        throw new Error("PDF is password protected and cannot be opened.");
      }
      throw new Error(
        "Failed to extract text from PDF. The file may be image-based."
      );
    }
  };

  const extractTextFromDOCX = async (docxData) => {
    try {
      const result = await mammoth.extractRawText({
        arrayBuffer: docxData,
        preserveLineBreaks: true,
      });
      return result.value;
    } catch (error) {
      console.error("DOCX extraction error:", error);
      throw new Error("Failed to extract text from Word document");
    }
  };

  const extractTextFromPPT = async (pptData) => {
    try {
      const formData = new FormData();
      formData.append("file", pptData);

      const response = await fetch("/api/extract-ppt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Extraction failed");

      const { text } = await response.json();
      return text;
    } catch (error) {
      console.error("PPT extraction error:", error);
      throw new Error(
        error.message.includes("password")
          ? "Password-protected PowerPoint files are not supported"
          : "Failed to extract text from PowerPoint file"
      );
    }
  };

  const extractTextFromTXT = async (txtData) => {
    try {
      if (txtData instanceof ArrayBuffer) {
        return new TextDecoder().decode(txtData);
      } else if (txtData instanceof Blob) {
        return await txtData.text();
      }
      return txtData.toString();
    } catch (error) {
      console.error("TXT extraction error:", error);
      throw new Error("Failed to read text file");
    }
  };

  const handleTextSelection = () => {
    if (error) return;

    const selection = window.getSelection();
    const selected = selection.toString().trim();

    if (selected) {
      setSelectedText(selected);
      onTextSelected(selected);
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 mt-4 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <h2
        className={`text-xl font-semibold mb-4 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Document Preview
      </h2>

      {error && (
        <div
          className={`mb-4 p-3 rounded-md ${
            darkMode ? "bg-red-900/50 text-red-200" : "bg-red-50 text-red-700"
          }`}
        >
          <p className="font-medium">Error:</p>
          <p>{error}</p>
          <p
            className={`mt-2 text-sm ${
              darkMode ? "text-red-300" : "text-red-600"
            }`}
          >
            Try a different file or check if the file contains selectable text.
          </p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="flex justify-center items-center space-x-2">
            <div
              className={`w-4 h-4 rounded-full animate-bounce ${
                darkMode ? "bg-blue-400" : "bg-blue-600"
              }`}
            ></div>
            <div
              className={`w-4 h-4 rounded-full animate-bounce delay-100 ${
                darkMode ? "bg-blue-400" : "bg-blue-600"
              }`}
            ></div>
            <div
              className={`w-4 h-4 rounded-full animate-bounce delay-200 ${
                darkMode ? "bg-blue-400" : "bg-blue-600"
              }`}
            ></div>
          </div>
          <p className={`mt-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Processing document...
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Document Display */}
          <div className="flex-1">
            <p
              className={`mb-2 text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {error
                ? "Upload a different file to generate questions"
                : "Select text from your document to generate questions:"}
            </p>

            <div
              className={`p-4 border rounded max-h-96 overflow-y-auto ${
                error
                  ? darkMode
                    ? "bg-gray-700/50 text-gray-400"
                    : "bg-gray-100 text-gray-500"
                  : darkMode
                  ? "bg-gray-700/50 text-gray-200 cursor-text"
                  : "bg-gray-50 cursor-text"
              }`}
              onMouseUp={handleTextSelection}
            >
              <pre
                className={`whitespace-pre-wrap font-sans text-sm ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {error
                  ? "No text available from the uploaded document"
                  : documentText || "Document content will appear here"}
              </pre>
            </div>
          </div>

          {/* Selected Text Display */}
          <div className="flex-1 md:border-l md:pl-4">
            <p
              className={`mb-2 text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Selected Text:
            </p>
            <div
              className={`p-4 border rounded max-h-96 overflow-y-auto ${
                darkMode
                  ? "bg-blue-900/30 border-blue-700"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              {selectedText ? (
                <pre
                  className={`text-sm font-sans whitespace-pre-wrap ${
                    darkMode ? "text-blue-100" : "text-blue-800"
                  }`}
                >
                  {selectedText}
                </pre>
              ) : (
                <p
                  className={`text-sm italic ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  No text selected yet. Select text from the document to see it
                  here.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
