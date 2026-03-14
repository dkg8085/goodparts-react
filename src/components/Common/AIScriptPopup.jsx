import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { MoonLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAiScript,
  saveAiScript,
  saveAndAddAiScript,
  addToShowSheet,
} from "../../redux/thunks/aiScriptThunks";

const AIScriptPopup = ({
  isOpen,
  onClose,
  query,
  setQuery,
  showResult,
  setShowResult,
}) => {
  // const [query, setQuery] = useState("");
  // const [showResult, setShowResult] = useState(false);
  const [loadingButton, setLoadingButton] = useState(null);
  const dispatch = useDispatch();

  const { answer, status, error } = useSelector((state) => state.aiScript);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.ID;
  const loading = status === "loading";
  // const handleAddToShowSheet = () => {
  //   dispatch(
  //     addToShowSheet({
  //       que: query,
  //       ans: answer,
  //     }),
  //   );
  // };
  // const handleSaveScript = () => {
  //   dispatch(
  //     saveAiScript({
  //       title: query,
  //       content: answer,
  //       user_id: userId,
  //     }),
  //   );
  // };
  // const handleSaveAndAdd = () => {
  //   dispatch(
  //     saveAndAddAiScript({
  //       que: query,
  //       ans: answer,
  //       usr: userId,
  //     }),
  //   );
  // };
  const handleAddToShowSheet = () => {
    const storedScripts = JSON.parse(localStorage.getItem("showSheetScripts")) || [];
  
    const newScript = {
      id: Date.now(), // unique ID
      question: query,
      answer: answer,
    };
  
    const updatedScripts = [newScript, ...storedScripts];
    localStorage.setItem("showSheetScripts", JSON.stringify(updatedScripts));
  
    // optionally update Redux if needed
    dispatch({ type: "aiScript/setShowSheet", payload: updatedScripts });
    onClose();
  };

const handleSaveScript = () => {
  setLoadingButton("save");
  dispatch(saveAiScript({ title: query, content: answer, user_id: userId }))
    .unwrap()
    .then(() => window.location.reload())
    .finally(() => setLoadingButton(null));
};

const handleSaveAndAdd = () => {
  setLoadingButton("addSave");
  dispatch(saveAndAddAiScript({ que: query, ans: answer, usr: userId }))
    .unwrap()
    .then(() => window.location.reload())
    .finally(() => setLoadingButton(null));
};

  // const [loading, setLoading] = useState(false);
  // const [gptResult, setGptResult] = useState("");
  // const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(fetchAiScript({ search: query }))
      .unwrap()
      .then(() => {
        setShowResult(true);
      })
      .catch(() => {
        setShowResult(false);
      });
  };

  const handleReset = () => {
    setQuery("");
    setShowResult(false);
  };

  return (
    <div className="ai_popup">
      <div className="ai_popup_content">
        <div className="ai_popup_body">
          <div className="ai_script_content">
            {/* Close button */}
            <div className="ai_close" onClick={onClose}>
              <span></span>
              <span></span>
            </div>

            {/* 🔹 TOP SECTION*/}
            {!showResult && (
              <>
                <div className="ai_script_title">
                  <h4>Write script (AI Tools)</h4>
                </div>

                <div className="ai_script_request">
                  <div className="ai_script_info">
                    <p>
                      This tool provides you the ability to create your own
                      scripts using AI.
                    </p>
                  </div>

                  <form id="ai_chatgpt" onSubmit={handleSubmit}>
                    <input
                      type="text"
                      placeholder="Write a script."
                      id="ai_search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <button className="btn-info" type="submit" disabled={loading}>
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                  </form>

                  {loading && (
                    <div className="script_ajax-loading">
                      <img src="/assets/images/loading.gif" alt="Ajax Loader" width="100px"/>
                    </div>
                  )}

                  {error && (
                    <div className="script_error">
                      <div className="script_error_msg">{error}</div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* RESULT SECTION */}
            <div className="result-section">
            {showResult && (
              <div className="ai_script_result">
                <h4>Write script (AI Tools)</h4>

                <div className="request_search">
                  <p>
                    <span className="user_write">
                      <strong>You written:&nbsp;</strong>
                    </span>
                    {query}
                  </p>
                </div>

                <div className="request_result">
                  <p
                    className="gpt_result"
                    dangerouslySetInnerHTML={{ __html: answer }}
                  ></p>
                </div>

                {/* <div className="scripts_save">
                  <button
                    className="scripts-btns btn-info"
                    onClick={handleAddToShowSheet}
                  >
                    Add to Show sheet
                  </button>

                  <button
                    className="scripts-btns btn-info"
                    onClick={handleSaveScript}
                  >
                    Save AI Script
                  </button>

                  <button
                    className="scripts-btns btn-info"
                    onClick={handleSaveAndAdd}
                  >
                    Add & Save
                  </button>

                  <button
                    type="button"
                    className="scripts-btns btn-info"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div> */}
                <div className="scripts_save">
    {/* Add to Show sheet */}
    <button
      className={`scripts-btns btn-info ${
        loadingButton === "add" ? "btn-fade" : ""
      }`}
      onClick={handleAddToShowSheet}
      disabled={loadingButton !== null}
    >
      {loadingButton === "add" ? (
        <span className="ajax-loader">
          <img src="/assets/images/round-loader.gif" alt="Loader" />
        </span>
      ) : (
        "Add to Show sheet"
      )}
    </button>

    {/* Save AI Script */}
    <button
      className={`scripts-btns btn-info ${
        loadingButton === "save" ? "btn-fade" : ""
      }`}
      onClick={handleSaveScript}
      disabled={loadingButton !== null}
    >
      {loadingButton === "save" ? (
        <span className="ajax-loader">
          <img src="/assets/images/round-loader.gif" alt="Loader" />
        </span>
      ) : (
        "Save AI Script"
      )}
    </button>

    {/* Add & Save */}
    <button
      className={`scripts-btns btn-info ${
        loadingButton === "addSave" ? "btn-fade" : ""
      }`}
      onClick={handleSaveAndAdd}
      disabled={loadingButton !== null}
    >
      {loadingButton === "addSave" ? (
        <span className="ajax-loader">
          <img src="/assets/images/round-loader.gif" alt="Loader" />
        </span>
      ) : (
        "Add & Save"
      )}
    </button>

    {/* Reset – NO loader */}
    <button
      type="button"
      className="scripts-btns btn-info"
      onClick={handleReset}
    >
      Reset
    </button>
  </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default AIScriptPopup;
