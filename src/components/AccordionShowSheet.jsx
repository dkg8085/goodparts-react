import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleMinus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import MediaList from "./Common/MediaList";
import ScriptList from "./Common/ScriptList";
import { MoonLoader } from "react-spinners";
import { accordionShowSheet } from "../redux/thunks/AccordionShowSheetThunk";
import ShowSheetSaveButton from "./ShowSheetSaveButton";
import AddSection from "./Common/AddSection";
import ShowSheetSelectBtn from "./Common/ShowSheetSelectBtn";
import ShowSheetPrintAndRemove from "./Common/ShowSheetPrintAndRemove";
import AIScriptPopup from "./Common/AIScriptPopup";

const AccordionShowSheet = () => {
  const dispatch = useDispatch();
  const { accordionShowSheetPosts, loading } = useSelector(
    (state) => state.accordionShowSheet
  );

  // Local state for AI scripts and UI
  const [isAiPopupOpen, setIsAiPopupOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [orderedItems, setOrderedItems] = useState([]); // the full ordered list
  const [scriptUpdateFlag, setScriptUpdateFlag] = useState(0); // to force refresh after AI popup closes

  // Drag refs
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  // Accordion open/close indices
  const [openIndices, setOpenIndices] = useState([]);

  // Selected IDs for print/remove
  const [selectedBtnIds, setSelectedBtnIds] = useState([]);

  // Fetch Redux posts on mount
  useEffect(() => {
    dispatch(accordionShowSheet());
  }, [dispatch]);

  // Build the combined list from Redux posts and localStorage scripts
  const buildCombinedItems = useCallback(() => {
    // Get scripts from localStorage
    const storedScripts = JSON.parse(localStorage.getItem("showSheetScripts")) || [];
    const mappedScripts = storedScripts.map((script) => ({
      ID: script.id,
      title: script.question,
      custom_fields: {
        prep_content: script.answer,
        media_list_items: [],
        add_script: ["yes"],
      },
      isAIScript: true,
    }));

    // Redux posts (if available)
    const reduxPosts = accordionShowSheetPosts?.data || [];
    const mappedPosts = reduxPosts.map((post) => ({
      ...post,
      isAIScript: false,
    }));

    // Combine – scripts first, then posts (you can change order as needed)
    return [...mappedScripts, ...mappedPosts];
  }, [accordionShowSheetPosts]);

  // Initialize orderedItems when the underlying data changes
  // BUT we only want to reset the order if the data set changes (e.g., new script added)
  // This simplistic approach resets to the default order every time, which may overwrite user drag.
  // For production, you would implement a more sophisticated merge (e.g., using IDs).
  // However, for the purpose of enabling drag on AI scripts, this is acceptable.
  useEffect(() => {
    setOrderedItems(buildCombinedItems());
  }, [buildCombinedItems, scriptUpdateFlag]); // also re-run when scriptUpdateFlag changes

  // Close AI popup and trigger a refresh
  const handleClosePopup = () => {
    setQuery("");
    setIsAiPopupOpen(false);
    setShowResult(false);
    setScriptUpdateFlag((prev) => prev + 1); // rebuild list after AI script added
  };

  // Drag & drop handler
  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;

    const reordered = [...orderedItems];
    const dragged = reordered[dragItem.current];
    // Remove dragged item
    reordered.splice(dragItem.current, 1);
    // Insert at new position
    reordered.splice(dragOverItem.current, 0, dragged);

    setOrderedItems(reordered);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // Toggle accordion panel
  const toggleItem = (index) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Selection handler
  const handleSelectBtnClick = (btnID) => {
    setSelectedBtnIds((prev) =>
      prev.includes(btnID) ? prev.filter((id) => id !== btnID) : [...prev, btnID]
    );
  };

  // Refresh Redux data (used by AddSection and after removal)
  const refreshAccordionData = () => {
    dispatch(accordionShowSheet());
  };

  // IDs for all items (used by Save button and Print/Remove)
  const allItemIds = orderedItems.map((item) => item.ID);

  return (
    <div className="show-sheet-wrap">
      <div className="show-sheet-heading">
        <h2>Your Content</h2>
      </div>
      <div className="show-header-wrap">
        <div className="left-btn-sec">
          <AddSection
            addedSections={orderedItems.filter((i) => !i.isAIScript).map((i) => i.ID)} // only real post IDs
            setAddedSections={() => {}} // not needed for drag version
            refreshAccordionData={refreshAccordionData}
            contextType={"accordion"}
          />
        </div>
        <div className="right-btn-sec">
          <button
            className="write-script-btn"
            onClick={() => setIsAiPopupOpen(true)}
          >
            <img src="/assets/images/pencil-line.svg" alt="pencil-line" />
            Write Script (AI Tools)
          </button>

          <ShowSheetPrintAndRemove
            allShowSheetpostIds={allItemIds}
            selectedBtnIds={selectedBtnIds}
            AllPostData={orderedItems} // pass the ordered list
            page="tagShowSheet"
            refreshData={refreshAccordionData}
          />
        </div>
      </div>

      <div className="show-sheet-posts-list">
        {loading ? (
          <div className="loader-overlay">
            <MoonLoader color="#15273B" loading={loading} size={50} />
          </div>
        ) : orderedItems.length > 0 ? (
          <ul className="show-sheet-table">
            {orderedItems.map((item, index) => (
              <li
                className="show-sheet-item"
                key={`${item.ID}-${item.isAIScript ? 'ai' : 'post'}`}
                draggable
                onDragStart={() => (dragItem.current = index)}
                onDragEnter={() => (dragOverItem.current = index)}
                onDragEnd={handleSort}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="accordion-button-wrap">
                  <div
                    className="accordion-button"
                    onClick={() => toggleItem(index)}
                  >
                    <FontAwesomeIcon
                      icon={
                        openIndices.includes(index)
                          ? faCircleMinus
                          : faCirclePlus
                      }
                      className="icon"
                    />
                    {item.title}
                  </div>
                  <div className="select-div">
                    <ShowSheetSelectBtn
                      btnID={item.ID}
                      isSelected={selectedBtnIds.includes(item.ID)}
                      onSelectClick={handleSelectBtnClick}
                    />
                  </div>
                </div>

                {(item.custom_fields?.prep_content ||
                  item.custom_fields?.media_list_items?.length > 0 ||
                  item.custom_fields?.add_script?.[0] === "yes") && (
                  <div
                    className={`panel ${
                      openIndices.includes(index) ? "open" : ""
                    }`}
                  >
                    {openIndices.includes(index) && (
                      <div className="panel-content">
                        <div className="accordion-content-wrap">
                          <p
                            dangerouslySetInnerHTML={{
                              __html: item.custom_fields?.prep_content || "",
                            }}
                          />
                        </div>
                        <div className="post-media-list">
                          {item.custom_fields?.media_list_items?.length > 0 &&
                            item.media_post_data?.map((media, mediaIndex) => (
                              <MediaList key={mediaIndex} mediaList={media} />
                            ))}

                          {item.custom_fields?.add_script?.[0] === "yes" && (
                            <ScriptList scriptList={item} />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No show sheets available.</p>
        )}
      </div>

      <ShowSheetSaveButton accordionItemsID={allItemIds} btntype="save" />

      <AIScriptPopup
        isOpen={isAiPopupOpen}
        query={query}
        setQuery={setQuery}
        onClose={handleClosePopup}
        showResult={showResult}
        setShowResult={setShowResult}
      />
    </div>
  );
};

export default AccordionShowSheet;