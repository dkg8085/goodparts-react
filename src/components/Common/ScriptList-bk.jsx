import React, { useRef } from "react";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ScriptList({ scriptList }) {
  const contentRef = useRef();

  // Safely extract a string from a field that could be a string, array, or object
  const extractString = (field) => {
    if (!field) return null;
    if (Array.isArray(field)) {
      // If it's an array, take the first element if it's a string
      return typeof field[0] === 'string' ? field[0] : null;
    }
    if (typeof field === 'string') return field;
    return null;
  };

  // Helper to get the actual script text from all possible locations
  const getScriptContent = () => {
    // AI scripts (mapped in AccordionShowSheet)
    if (scriptList?.custom_fields?.prep_content) {
      const val = extractString(scriptList.custom_fields.prep_content);
      if (val) return val;
    }
    // Manually added scripts might use place_script
    if (scriptList?.custom_fields?.place_script) {
      const val = extractString(scriptList.custom_fields.place_script);
      if (val) return val;
    }
    if (scriptList?.meta?.place_script) {
      const val = extractString(scriptList.meta.place_script);
      if (val) return val;
    }
    // For pranks/listeners (archive posts), the script might be in pulse_media_script
    if (scriptList?.custom_fields?.pulse_media_script) {
      const val = extractString(scriptList.custom_fields.pulse_media_script);
      if (val) return val;
    }
    // Direct from localStorage (if object is passed as-is)
    if (scriptList?.answer) {
      const val = extractString(scriptList.answer);
      if (val) return val;
    }
    return "No script available";
  };

  const scriptContent = String(getScriptContent() ?? ""); // ensure it's a string
  const plainText = scriptContent.replace(/<[^>]*>/g, ""); // remove HTML tags

  // Generate a safe filename from the title
  const fileName = (scriptList?.title || "script")
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase() + "_script.txt";

  const handleDownload = (event) => {
    event.preventDefault();
    const blob = new Blob([plainText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="media-list-wrapper">
      <div className="media-player">
        <div className="custom-player media-view" style={{ position: "relative" }}>
          <a className="script" href="#" onClick={handleDownload}>
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
          <a className="downloadLink" href="#" onClick={handleDownload}>
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