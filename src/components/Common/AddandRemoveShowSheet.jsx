import { useDispatch, useSelector } from "react-redux";
import { toggleShowSheet } from "../../redux/thunks/AddShowSheetThunk";
import { accordionShowSheet } from "../../redux/thunks/AccordionShowSheetThunk";
import Spinners from '../Common/Spinners'
import { useState, useEffect } from "react";

export default function AddandRemoveShowSheet({ itemid }) {
    const dispatch = useDispatch();

    const { accordionShowSheetPosts, loading, error } = useSelector((state) => state.accordionShowSheet);

    const [isLoading, setIsLoading] = useState(false);

    const handleShowSheetBtnClick = async (e, postId, action) => {
        setIsLoading(true);
        e.preventDefault();
        await dispatch(toggleShowSheet({ postId, action }));
        await dispatch(accordionShowSheet());
        setIsLoading(false);
    };

     useEffect(() => {
        dispatch(accordionShowSheet());
    }, [dispatch]);

    const isItemInShowSheet = accordionShowSheetPosts?.data?.some((item) => item.ID === itemid);

    return (
        <>
            {isItemInShowSheet ? (
                <a
                    className="showsheet_action_btn"
                    data-id={itemid}
                    title="Remove from your show sheet"
                    onClick={(e) => handleShowSheetBtnClick(e, itemid, "remove")}
                >
                    {isLoading && (
                           <Spinners />
                    )}
                    Remove from Show Sheet
                </a>
            ) : (
                <a
                    className="showsheet_action_btn"
                    data-id={itemid}
                    title="Add to your show sheet"
                    onClick={(e) => handleShowSheetBtnClick(e, itemid, "add")}
                >
                    {isLoading && (
                          <Spinners />
                    )}
                    Add to Show Sheet
                </a>
            )}
        </>
    );
}
