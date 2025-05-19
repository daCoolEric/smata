"use client";
import { useState, useEffect } from "react";
import mammoth from "mammoth";

export default function DocumentViewer({ file, fileContent, onTextSelected }) {
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
          normalizeWhitespace: false, // Preserve original whitespace
          disableCombineTextItems: false, // Keep text items separate for better formatting
        });

        // Group text items by their Y position to maintain line structure
        const textItemsByLine = {};

        content.items.forEach((item) => {
          // Use transform matrix to get exact position if available
          const y = item.transform ? item.transform[5] : 0;
          if (!textItemsByLine[y]) {
            textItemsByLine[y] = [];
          }
          textItemsByLine[y].push(item);
        });

        // Sort lines by Y position (top to bottom)
        const sortedLines = Object.keys(textItemsByLine)
          .sort((a, b) => b - a) // Higher Y values come first (PDF coordinate system)
          .map((y) => textItemsByLine[y]);

        // Process each line
        for (const line of sortedLines) {
          // Sort items in the line by X position (left to right)
          line.sort((a, b) => {
            const aX = a.transform ? a.transform[4] : 0;
            const bX = b.transform ? b.transform[4] : 0;
            return aX - bX;
          });

          // Build the line text
          let lineText = "";
          let lastX = 0;

          for (const item of line) {
            const itemX = item.transform ? item.transform[4] : 0;

            // Add spaces if there's a significant gap between items
            if (itemX - lastX > 5 && lastX !== 0) {
              // 5 is an arbitrary threshold
              lineText += " ";
            }

            lineText += item.str;
            lastX = itemX + (item.width || 0);
          }

          text += lineText + "\n";
        }

        // Add page break if not the last page
        if (i < pdf.numPages) {
          // text += "\n--- Page Break ---\n\n";
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
    <div className="border rounded-lg p-4 mt-4 bg-white">
      <h2 className="text-xl font-semibold mb-4">Document Preview</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
          <p className="mt-2 text-sm">
            Try a different file or check if the file contains selectable text.
          </p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="flex justify-center items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce"></div>
            <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce delay-100"></div>
            <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce delay-200"></div>
          </div>
          <p className="mt-3 text-gray-600">Processing document...</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Document Display */}
          <div className="flex-1">
            <p className="mb-2 text-sm text-gray-600">
              {error
                ? "Upload a different file to generate questions"
                : "Select text from your document to generate questions:"}
            </p>

            <div
              className={`p-4 border rounded ${
                error ? "bg-gray-100 text-gray-500" : "bg-gray-50 cursor-text"
              } max-h-96 overflow-y-auto`}
              onMouseUp={handleTextSelection}
            >
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {error
                  ? "No text available from the uploaded document"
                  : documentText || "Document content will appear here"}
              </pre>
            </div>
          </div>

          {/* Selected Text Display */}
          <div className="flex-1 md:border-l md:pl-4">
            <p className="mb-2 text-sm text-gray-600">Selected Text:</p>
            <div className="p-4 border rounded bg-blue-50 border-blue-200 max-h-96 overflow-y-auto">
              {selectedText ? (
                <pre className="text-sm font-sans whitespace-pre-wrap">
                  {selectedText}
                </pre>
              ) : (
                <p className="text-sm text-gray-500 italic">
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
