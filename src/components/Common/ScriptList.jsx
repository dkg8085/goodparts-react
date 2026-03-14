import React, { useRef } from "react";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import jsPDF from "jspdf"; // ✅ Import jsPDF

export default function ScriptList({ scriptList }) {
  const contentRef = useRef();

  const extractString = (field) => {
    if (!field) return null;
    if (Array.isArray(field)) {
      return typeof field[0] === "string" ? field[0] : null;
    }
    if (typeof field === "string") return field;
    return null;
  };

  const getScriptContent = () => {
    if (scriptList?.custom_fields?.place_script) {
      const val = extractString(scriptList.custom_fields.place_script);
      if (val) return val;
    }
    if (scriptList?.meta?.place_script) {
      const val = extractString(scriptList.meta.place_script);
      if (val) return val;
    }
    if (scriptList?.custom_fields?.prep_content) {
      const val = extractString(scriptList.custom_fields.prep_content);
      if (val) return val;
    }
    if (scriptList?.custom_fields?.pulse_media_script) {
      const val = extractString(scriptList.custom_fields.pulse_media_script);
      if (val) return val;
    }
    if (scriptList?.answer) {
      const val = extractString(scriptList.answer);
      if (val) return val;
    }
    return "No script available";
  };

  const scriptContent = String(getScriptContent() ?? "");
  const plainText = scriptContent.replace(/<[^>]*>/g, ""); // strip HTML for PDF

  // Generate a safe filename (without extension, jsPDF will add .pdf)
  const fileName =
    (scriptList?.title || "script").replace(/[^a-z0-9]/gi, "_").toLowerCase() +
    "_script";

  // Open script in new tab (unchanged)
  const handleOpenScript = (event) => {
    event.preventDefault();
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>${scriptList?.title || "Script"}</title>
            <style>
              body { font-family: sans-serif; padding: 20px; line-height: 1.6; }
              .script-content { max-width: 800px; margin: 0 auto; }
            </style>
          </head>
          <body>
            <div class="script-content">
              ${scriptContent}
            </div>
          </body>
        </html>
      `);
      win.document.close();
    }
  };

  // ✅ NEW: Download as PDF using jsPDF
  const handleDownloadPDF = (event) => {
    event.preventDefault();

    // Create a new PDF document
    const doc = new jsPDF();

    // Set title
    const title = scriptList?.title || "Script";
    doc.setFontSize(16);
    doc.text(title, 10, 10);

    // Add the script content (plain text, wrapped)
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(plainText, 180); // wrap to fit width
    doc.text(lines, 10, 20);

    // Save the PDF
    doc.save(`${fileName}.pdf`);
  };

  return (
    <div className="media-list-wrapper">
      <div className="media-player">
        <div className="custom-player media-view" style={{ position: "relative" }}>
          <a
            className="script"
            href="#"
            onClick={handleOpenScript}
            style={{ cursor: "pointer" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="script">
              <g>
                <path d="M20 13a5 5 0 0 1-5-5V3.14A2.939 2.939 0 0 1 15.23 2H9a3.009 3.009 0 0 0-3 3v22a3.009 3.009 0 0 0 3 3h14a3.009 3.009 0 0 0 3-3V12.82a2.772 2.772 0 0 1-1 .18Zm-5.293 10.293a1 1 0 1 1-1.414 1.414l-2-2a1 1 0 0 1 0-1.414l2-2a1 1 0 0 1 1.414 1.414L13.414 22Zm6-.586-2 2a1 1 0 0 1-1.414-1.414L18.586 22l-1.293-1.293a1 1 0 0 1 1.414-1.414l2 2a1 1 0 0 1 0 1.414Z" />
                <path d="M24.953 7.643 19.21 2.721a3.157 3.157 0 0 0-.839-.51A1 1 0 0 0 17 3.14V8a3 3 0 0 0 3 3h5a1 1 0 0 0 1-1v-.08a3.008 3.008 0 0 0-1.047-2.277Z" />
              </g>
            </svg>
          </a>
        </div>
      </div>
      <div className="media-des">SCRIPT</div>
      <div className="media-length-download">
        <div className="media-lengthscript"></div>
        <div className="media-length1"></div>
        <div className="media-download">
          <a className="downloadLink" href="#" onClick={handleDownloadPDF}>
            <FontAwesomeIcon icon={faDownload} />
          </a>
        </div>
        <div
          id="script-content"
          ref={contentRef}
          style={{ display: "none" }}
          dangerouslySetInnerHTML={{ __html: scriptContent }}
        />
      </div>
    </div>
  );
}