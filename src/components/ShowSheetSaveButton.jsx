import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateShowSheet } from '../redux/thunks/CreateNewShowSheetThunk';
import { updateSavedShowSheet } from '../redux/thunks/updateSavedShowSheetThunk';
import { Link, useLocation } from "react-router-dom";
import { clearMessage } from "../redux/slices/CreateNewShowSheetSlice";

export default function ShowSheetSaveButton({ accordionItemsID, btntype }) {
    const dispatch = useDispatch();
    const [showPopup, setShowPopup] = useState(false);
    const [showUpdateMessagePopup, setShowUpdateMessagePopup] = useState(false);
    const [createShowSheetMsg, setCreateShowSheetMsg] = useState("");

    const location = useLocation();
    const { id } = location.state || {};

    const { createShowSheet, message } = useSelector((state) => state.createShowSheet);
    const { updateSavedShowSheetMessage } = useSelector((state) => state.savedshowSheetMessage);

    // useEffect(() => {
    //     if (createShowSheet?.message) {
    //         setCreateShowSheetMsg(createShowSheet.message);
    //     }
    // }, [createShowSheet]);

    useEffect(() => {
        if (message) {
            setCreateShowSheetMsg(message);
        }
    }, [message]);

    useEffect(() => {
        if (updateSavedShowSheetMessage?.message) {
            setShowUpdateMessagePopup(true);
        }
    }, [updateSavedShowSheetMessage]);

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const user_id = user?.ID;

    const handleChange = (e) => {
        setPayload({ ...payload, [e.target.name]: e.target.value });
    };

    const [payload, setPayload] = useState({
        title: "",
        post_ids: accordionItemsID || [],
        user_id
    });

    const handleShowSheetUpdate = () => {
        const payload = {
            user_id: user_id,
            showsheet_id: id,
            post_ids: accordionItemsID
        };
        dispatch(updateSavedShowSheet(payload));
    };

    const saveShowSheet = async (e) => {
        e.preventDefault();
        dispatch(CreateShowSheet(payload));
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setCreateShowSheetMsg("");
        dispatch(clearMessage());
        setPayload({ title: "", post_ids: accordionItemsID, user_id });
    };

    const handleCloseUpdateMessagePopup = () => {
        setShowUpdateMessagePopup(false);
        dispatch(resetUpdateMessage());
    };

    useEffect(() => {
        setPayload((prevPayload) => ({
            ...prevPayload,
            post_ids: accordionItemsID || [],
        }));
    }, [accordionItemsID]);

    const renderPopup = () => (
        <div className="save-showsheet_popup" onClick={handleClosePopup}>
            <div className="showsheet_content" onClick={(e) => e.stopPropagation()}>
                <div className="showsheet_close" onClick={handleClosePopup}>
                    <span></span>
                    <span></span>
                </div>
                <div className="showsheet_notice"></div>
                <div className="showsheet_content-title showsheet_pre">
                    <div className="showsheet_title">
                        <h4>New Show Sheet</h4>
                    </div>
                </div>
                <div className="showsheet_body showsheet_pre">
                    {createShowSheetMsg ? (
                        <p >{createShowSheetMsg}</p>
                    ) : (
                        <form id="showsheet_save_form" onSubmit={saveShowSheet}>
                            <input
                                type="text"
                                placeholder="Write show sheet title."
                                name="title"
                                value={payload.title}
                                onChange={handleChange}
                                required
                                className="showsheet_save_input"
                            />
                            <button className="showsheet_save_btn" type="submit">
                                Save
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );

    const renderUpdateMessagePopup = () => (
        <div className="save-showsheet_popup" onClick={handleCloseUpdateMessagePopup}>
            <div className="showsheet_content" onClick={(e) => e.stopPropagation()}>
                <div className="showsheet_close" onClick={handleCloseUpdateMessagePopup}>
                    <span></span>
                    <span></span>
                </div>
                <div className="showsheet_notice"></div>

                <div className="showsheet_body showsheet_pre">
                    <p>{updateSavedShowSheetMessage.message}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="show-sheet-btns">
            {btntype === 'update' && (
                <button className="btn-open-popup" onClick={handleShowSheetUpdate}>
                    Update
                </button>
            )}
            <button onClick={() => setShowPopup(true)} className="btn-open-popup">
                <span>
                    <FontAwesomeIcon icon={faDownload} />
                </span>
                Save as New
            </button>
            {showPopup && renderPopup()}
            {showUpdateMessagePopup && renderUpdateMessagePopup()}
            {btntype === 'save' && (
                <Link to='/prep-showsheet'>Saved Show sheets</Link>
            )}
        </div>
    );
}