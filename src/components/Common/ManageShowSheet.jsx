import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userShowSheet } from "../../redux/thunks/UserShowSheetThunk";
import { updateShowSheet } from "../../redux/thunks/UpdateShowSheetThunk";
import { resetUpdateShowSheetMessage } from "../../redux/slices/UpdateShowSheetSlice";
import Spinners from '../Common/Spinners'

export default function ManageShowSheet(itemId) {
    const [isManageShowSheetOpen, setIsManageShowSheetOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const { showSheetPosts, loading } = useSelector((state) => state.showSheetPosts || {});
    const { updateShowSheetMessage } = useSelector((state) => state.updateShowSheetMessage || {});
    const [checkedItems, setCheckedItems] = useState({});

    useEffect(() => {
        if (showSheetPosts?.data) {
            const initialCheckedState = showSheetPosts.data.reduce((acc, item) => {
                acc[item.id] = item.user_showsheet_saved.some(val => val == itemId.itemid);
                return acc;
            }, {});
            setCheckedItems(initialCheckedState);
        }
    }, [showSheetPosts, itemId]);

    useEffect(() => {
        if (updateShowSheetMessage?.message) {
            setMessage(updateShowSheetMessage.message);
        }
    }, [updateShowSheetMessage]);

    const handleCheckboxChange = (postId) => {
        setCheckedItems((prev) => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const handleUpdateShowSheet = () => {
        const selectedItems = Object.keys(checkedItems).filter((key) => checkedItems[key]);

        const formattedShowSheets = `{${Array.from(new Set(selectedItems)).join(",")}}`;

        const updateShowSheetData = {
            itemId: itemId?.itemid || null,
            selectedShowSheets: formattedShowSheets,
            action: 'add'
        };

        dispatch(updateShowSheet(updateShowSheetData)).then(() => {
            dispatch(userShowSheet(itemId));
        });
    };

    const closeModal = () => {
        setIsManageShowSheetOpen(false);
        setMessage("");
        dispatch(resetUpdateShowSheetMessage());
    };

    return (
        <>
            <a
                className="showsheet_action_btn"
                data-id={itemId.itemid}
                title="Manage show sheet"
                onClick={() => {
                    setIsLoading(true);
                    setIsManageShowSheetOpen(true);
                    dispatch(userShowSheet(itemId));
                    // setIsLoading(false);
                }}
            >
                {loading && (
                    <Spinners />
                )}
                Manage show sheet
            </a>

            {isManageShowSheetOpen && (
                <div className="manageShowSheetPopup">
                    {loading ? (
                        
                        <div className="loader-overlay1">
                        </div>
                    ) : (
                        <div className="popup-content">
                            <div
                                className="popup_close"
                                onClick={closeModal}
                                style={{ cursor: "pointer" }}
                            >
                                <span></span>
                                <span></span>
                            </div>
                            <div className="media_title">
                                <h2>Manage Show Sheet</h2>
                                <p>Select to add or remove from Show Sheets below.</p>
                            </div>

                            {/* Show message if available */}
                            {message ? (
                                <p>{message}</p>
                            ) : (
                                <div className="media_body">
                                    <div className="showsheet_posts">
                                        {showSheetPosts?.data?.length > 0 ? (
                                            showSheetPosts.data.map((item) => (
                                                <div key={item.id} className="showsheet_title">
                                                    <input
                                                        type="checkbox"
                                                        name={item.id}
                                                        className="update_post"
                                                        checked={checkedItems?.[item.id] || false}
                                                        onChange={() => handleCheckboxChange(item.id)}
                                                    />
                                                    <span>{item.title}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No show sheets available.</p>
                                        )}
                                    </div>
                                    <div className="update_showsheet_btn">
                                        <button onClick={handleUpdateShowSheet} className="btn-info" id="update_showsheet" type="button">
                                            Update show sheet
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
