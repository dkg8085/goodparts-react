import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectShowSheetRemove, selectSavedShowSheetRemove } from '../../redux/thunks/selectShowSheetRemoveThunk';
import { accordionShowSheet } from '../../redux/thunks/AccordionShowSheetThunk';
import { saveShowSheetPost } from '../../redux/thunks/savedShowSheetPostsThunk';
import { handlePrint } from '../../services/printService';

const ShowSheetPrintAndRemove = ({
  allShowSheetpostIds,
  selectedBtnIds,
  AllPostData,
  page,
  refreshData,
}) => {
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const printRef = useRef(null);
  const removeRef = useRef(null);
  const dispatch = useDispatch();

  const handleClickOutside = (event) => {
    if (printRef.current && !printRef.current.contains(event.target)) {
      setIsPrintOpen(false);
    }
    if (removeRef.current && !removeRef.current.contains(event.target)) {
      setIsRemoveOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const user_id = user?.ID;

  const location = useLocation();
  const { id } = location.state || {};

  // Helper: separate script IDs from real post IDs
  const separateIds = (ids) => {
    const scriptIds = [];
    const realPostIds = [];
    ids.forEach((id) => {
      // Find the item in AllPostData to check if it's a script
      const item = AllPostData.find((data) => data.ID === id);
      if (item?.isAIScript) {
        scriptIds.push(id);
      } else {
        realPostIds.push(id);
      }
    });
    return { scriptIds, realPostIds };
  };

  const handleRemove = (type) => {
    const idsToRemove = type === 'selected' ? selectedBtnIds : allShowSheetpostIds;
    const { scriptIds, realPostIds } = separateIds(idsToRemove);

    // 1. Remove scripts from localStorage
    const storedScripts = JSON.parse(localStorage.getItem("showSheetScripts")) || [];
    const updatedScripts = storedScripts.filter(
      (script) => !scriptIds.includes(script.id)
    );
    localStorage.setItem("showSheetScripts", JSON.stringify(updatedScripts));

    // 2. Remove real posts via Redux (only if there are any)
    if (realPostIds.length > 0) {
      if (page !== 'tagShowSheet' && page !== 'savedShowSheet') return;

      const payload = {
        user_id: user_id,
        post_ids: realPostIds,
        ...(page === 'savedShowSheet' && { showsheet_id: id }),
      };

      if (page === 'savedShowSheet') {
        dispatch(selectSavedShowSheetRemove(payload));
      } else if (page === 'tagShowSheet') {
        dispatch(selectShowSheetRemove(payload));
      }
    }

    // 3. Refresh data
    dispatch(accordionShowSheet());
    dispatch(saveShowSheetPost(id));
    refreshData();
  };

  return (
    <>
      <div className="btn-section-wrap" ref={printRef}>
        <button onClick={() => setIsPrintOpen(!isPrintOpen)} className="dropdown-toggle">
          <img src="/assets/images/print.svg" alt="Print" width="26px" />
          Print Show Sheet
        </button>
        {isPrintOpen && (
          <div className="dropdown-menu">
            <button
              onClick={() => handlePrint('all', AllPostData, selectedBtnIds)}
              className="dropdown-item"
            >
              Print All
            </button>
            <button
              onClick={() => handlePrint('selected', AllPostData, selectedBtnIds)}
              className="dropdown-item"
            >
              Print Selected
            </button>
          </div>
        )}
      </div>

      <div className="btn-section-wrap" ref={removeRef}>
        <button onClick={() => setIsRemoveOpen(!isRemoveOpen)} className="dropdown-toggle">
          <img src="/assets/images/remove.svg" alt="remove" width="26px" />
          Remove
        </button>
        {isRemoveOpen && (
          <div className="dropdown-menu">
            <button onClick={() => handleRemove('all')} className="dropdown-item">
              Remove All
            </button>
            <button onClick={() => handleRemove('selected')} className="dropdown-item">
              Remove Selected
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ShowSheetPrintAndRemove;