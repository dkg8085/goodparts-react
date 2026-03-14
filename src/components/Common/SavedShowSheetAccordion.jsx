import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faPrint, faTrashCan, faCirclePlus, faCircleMinus, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import MediaList from "./MediaList";
import ScriptList from "./ScriptList";
import { MoonLoader } from "react-spinners";
import { accordionShowSheet } from '../../redux/thunks/AccordionShowSheetThunk';
import ShowSheetSaveButton from '../ShowSheetSaveButton'
import ShowSheetSelectBtn from './ShowSheetSelectBtn'
import ShowSheetPrintAndRemove from './ShowSheetPrintAndRemove'
import AddSection from './AddSection'
import { useLocation } from "react-router-dom";
import { saveShowSheetPost } from '../../redux/thunks/savedShowSheetPostsThunk';
import AIScriptPopup from "./AIScriptPopup";

const SavedShowSheetAccordion = (savedPosts) => {

    const dispatch = useDispatch();
    const location = useLocation();
    const { id } = location.state || {};
    const showsheetId = id


    const { accordionShowSheetPosts, loading, error } = useSelector((state) => state.accordionShowSheet);

    const [isAiPopupOpen, setIsAiPopupOpen] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedBtnIds, setselectedBtnIds] = useState([]);
    const [openIndices, setOpenIndices] = useState([]);

    const [addedSections, setAddedSections] = useState([]);
    const [accordionShowSheetItems, setaccordionShowSheetItems] = useState([]);
    const dragItem = useRef(null);
    const dragOverItem = useRef(null);
    const ShowSheetpostIds = accordionShowSheetItems?.map(post => post.ID) || [];

      const handleClose = ()=>{
    setQuery("");
    setIsAiPopupOpen(false);
    setShowResult(false)
  }
    useEffect(() => {
        if (savedPosts) {
            setaccordionShowSheetItems(savedPosts?.savedShowSheetData);
            setAddedSections(savedPosts?.savedShowSheetData?.map(post => post.ID));
        }
    }, [savedPosts]);

    useEffect(() => {
        dispatch(accordionShowSheet());
    }, [dispatch]);


    const handleSortFun = () => {
        let _items = [...accordionShowSheetItems];
        const draggedItem = _items.splice(dragItem.current, 1)[0];
        _items.splice(dragOverItem.current, 0, draggedItem);
        setaccordionShowSheetItems(_items);
    };

    const refreshAccordionData = () => {
        dispatch(accordionShowSheet());
        setaccordionShowSheetItems(savedPosts?.savedShowSheetData);
        if (showsheetId) {
            dispatch(saveShowSheetPost(showsheetId));
        }
    }

    const toggleItem = (index) => {
        setOpenIndices((prevIndices) => {
            if (prevIndices.includes(index)) {
                return prevIndices.filter((i) => i !== index);
            } else {
                return [...prevIndices, index]; 
            }
        });
    };
    

    const handleSelectBtnClick = (btnID) => {
        setselectedBtnIds((prevSelectedIds) => {
            if (prevSelectedIds.includes(btnID)) {

                return prevSelectedIds.filter((id) => id !== btnID);
            } else {
                return [...prevSelectedIds, btnID];
            }
        });
    };

    return (
        <div className="show-sheet-main-wrap">
            <div className="show-header-wrap">
                <div className="left-btn-sec">
                    <AddSection addedSections={addedSections}
                        setAddedSections={setAddedSections}
                        refreshAccordionData={refreshAccordionData}
                        contextType={"saved"}
                    />
                </div>
                <div className="right-btn-sec">
                              <button
                                className="write-script-btn"
                                onClick={() => setIsAiPopupOpen(true)}
                              >
                                 <img src="/assets/images/pencil-line.svg" alt="P
                                 encil-line" width="26px"/>
                                Write Script (AI Tools)
                              </button>
                    
                    <ShowSheetPrintAndRemove
                        allShowSheetpostIds={ShowSheetpostIds}
                        selectedBtnIds={selectedBtnIds}
                        AllPostData={accordionShowSheetItems}
                        page='savedShowSheet'
                        refreshData={refreshAccordionData}
                    />
                </div>
            </div>

            <div className="show-sheet-posts-list">
                {loading ? (
                    <div className="loader-overlay">
                        <MoonLoader color="#15273B" loading={loading} size={50} />
                    </div>
                ) :
                    accordionShowSheetItems.length > 0 ? (
                        <ul className="show-sheet-table saved">
                            {accordionShowSheetItems.map((item, index) => (
                                <li
                                    className="show-sheet-item"
                                    key={index}
                                    draggable
                                    onDragStart={() => (dragItem.current = index)}
                                    onDragEnter={() => (dragOverItem.current = index)}
                                    onDragEnd={handleSortFun}
                                    onDragOver={(e) => e.preventDefault()}
                                >
                                    <div className="accordion-button-wrap">
                                        <div className="accordion-button" onClick={() => toggleItem(index)}>
                                            <FontAwesomeIcon
                                                icon={openIndices.includes(index) ? faCircleMinus : faCirclePlus}
                                                className="icon"
                                            />
                                            {item.title}
                                        </div>
                                        <div className="select-div">
                                            <ShowSheetSelectBtn
                                                key={item.ID}
                                                btnID={item.ID}
                                                isSelected={selectedBtnIds.includes(item.ID)}
                                                onSelectClick={handleSelectBtnClick}
                                            />
                                        </div>
                                    </div>
                                    {(item.custom_fields?.prep_content ||
                                        item.custom_fields?.media_list_items?.length > 0 ||
                                        item.custom_fields?.add_script?.[0] === "yes") && (
                                            <div className={`panel ${openIndices.includes(index) ? "open" : ""}`}>
                                                {openIndices.includes(index) && (
                                                    <div className="panel-content">
                                                        <div className="accordion-content-wrap">
                                                            <p
                                                                dangerouslySetInnerHTML={{
                                                                    __html: item.custom_fields?.prep_content || "",
                                                                }}
                                                            ></p>
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
            
            <ShowSheetSaveButton accordionItemsID={ShowSheetpostIds} btntype="update" />

            <AIScriptPopup
                isOpen={isAiPopupOpen}
                query={query}
                setQuery={setQuery}
                onClose={handleClose}
                showResult={showResult}
                setShowResult={setShowResult}
            />
    </div>
    );
};

export default SavedShowSheetAccordion;