import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faTrashCan, faCirclePlus, faCircleMinus } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { dropDownShowSheet } from "../../redux/thunks/AddActionShowSheetThunk";
import { CreateNewActionShowSheet } from "../../redux/thunks/CreateNewActionShowSheetThunk";
import { deleteNewSection } from "../../redux/thunks/DeleteNewSectionThunk";
import { addNewActionOnshowSheet } from "../../redux/thunks/AddNewSectionionThunk";
import { MoonLoader } from "react-spinners";
import { updateShowSheetBreak } from "../../redux/thunks/UpdateShowSheetBreakThunk";
import { clearCreateNewAction } from '../../redux/slices/CreateNewActionShowSheetSlice';
import { clearData } from '../../redux/slices/DeleteNewSectionionSlice';
import { useLocation } from "react-router-dom";
import Spinners from './Spinners'

const AddSection = ({ addedSections: addedSection, setAddedSections, refreshAccordionData, contextType }) => {
    const dispatch = useDispatch();
    const [loadingState, setLoadingState] = useState({});
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const user_id = user.ID || null;
    const location = useLocation();
    const { id } = location.state || {};
    const showsheetId = id
    const addedSections = addedSection?.map(el => Number(el))

    const { data } = useSelector((state) => state.addActionShowSheet);

    const { CreateNewAction } = useSelector((state) => state.createNewActionShowSheet);

    const { data: deletesection } = useSelector((state) => state.deleteNewSection);
    const { data: addSection, loading: addSectionLoading } = useSelector((state) => state.addNewAction);
    const [dropDownShowSheetList, setDropDownShowSheetList] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [addSectionMsg, setAddSectionMsg] = useState("");
    const [sectionData, setSectionData] = useState({ title: "", user_id });


    useEffect(() => {
        dispatch(dropDownShowSheet());
    }, [dispatch, addSection]);

    useEffect(() => {
        if (data?.sections) {
            setDropDownShowSheetList(data.sections);
        }
    }, [data]);

    useEffect(() => {
        if (CreateNewAction?.message) {
            setAddSectionMsg(CreateNewAction.message);
            dispatch(dropDownShowSheet());
        } else if (deletesection?.message) {
            setAddSectionMsg(deletesection?.message);
            setShowPopup(true)
            dispatch(dropDownShowSheet());
        }
    }, [CreateNewAction, dispatch, deletesection]);

    const handleClosePopup = () => {
        setShowPopup(false);
        setAddSectionMsg("");
        setSectionData({ title: "", user_id });
        dispatch(clearCreateNewAction());
        dispatch(clearData());
    };

    const handleSectionValChange = (e) => {
        setSectionData({ ...sectionData, [e.target.name]: e.target.value });
    };

    const saveShowSheet = (e) => {
        e.preventDefault();
        dispatch(CreateNewActionShowSheet(sectionData));
    };

    const handleSectionDelete = (id) => {
        dispatch(deleteNewSection({ id }))
    }

    const handleSectionAdd = (id) => {
        setLoadingState((prev) => ({ ...prev, [id]: true }));
        const isAdded = addedSections.includes(id);
        const actionType = isAdded ? "remove" : "add";
        if (contextType === "accordion") {
            dispatch(addNewActionOnshowSheet({
                section_id: id,
                user_id: user_id,
                action: actionType,
            })).then(() => {
                setAddedSections(prev => isAdded ? prev.filter(sectionId => sectionId !== id) : [...prev, id]);
                dispatch(dropDownShowSheet());
                refreshAccordionData();
                setIsDropdownOpen(false)
                setLoadingState((prev) => ({ ...prev, [id]: false }));
            });
        }
        if (contextType === "saved") {
            dispatch(updateShowSheetBreak({
                "break_id": id,
                "showsheet_id": showsheetId,
                "user_id": user_id,
                "action": actionType
            })).then(() => {
                setAddedSections(prev => isAdded ? prev.filter(sectionId => sectionId !== id) : [...prev, id]);
                dispatch(dropDownShowSheet());
                refreshAccordionData();
                setIsDropdownOpen(false)
                setLoadingState((prev) => ({ ...prev, [id]: false }));
            });
        }
    };


    return (
        <>

            <div className="btn-section-wrap" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <FontAwesomeIcon icon={faClock} className="btn-icon" /> Add Section
            </div>
            {isDropdownOpen && (
                <div className="dropdown-menu">
                    <p>
                        <a href="#" onClick={(e) => { e.preventDefault(); setShowPopup(true); }}>Add New</a>
                    </p>
                    <ul>
                        {dropDownShowSheetList?.length > 0 && dropDownShowSheetList.map((item) => (
                            <li key={item.id}>
                                <h4>{item.title}</h4>
                                <div className="drop-down-btn">
                                    {loadingState[item.id] && (
                                        <Spinners />
                                    )}
                                    <FontAwesomeIcon
                                        icon={addedSections?.includes(item?.id) ? faCircleMinus : faCirclePlus}
                                        className="btn-icon"
                                        onClick={() => handleSectionAdd(item?.id)}
                                    />
                                    <FontAwesomeIcon icon={faTrashCan} className="btn-icon" onClick={() => handleSectionDelete(item?.id)} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {showPopup && (
                <div className="save-showsheet_popup" onClick={handleClosePopup}>
                    <div className="showsheet_content" onClick={(e) => e.stopPropagation()}>
                        <div className="showsheet_close" onClick={handleClosePopup}>
                            <span></span>
                            <span></span>
                        </div>
                        <div className="showsheet_body showsheet_pre">
                            {addSectionMsg?.length ? (
                                <p className="success-message">{addSectionMsg}</p>
                            ) : (
                                <form id="showsheet_save_form" onSubmit={saveShowSheet}>
                                    <input
                                        type="text"
                                        placeholder="Write a section text..."
                                        name="title"
                                        value={sectionData.title}
                                        onChange={handleSectionValChange}
                                        required
                                        className="showsheet_save_input"
                                    />
                                    <button className="showsheet_save_btn" type="submit">Add</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddSection;

