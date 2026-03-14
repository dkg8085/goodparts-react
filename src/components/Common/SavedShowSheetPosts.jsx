import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MoonLoader } from "react-spinners";
import { saveShowSheetPost } from '../../redux/thunks/savedShowSheetPostsThunk';
import SavedShowSheetAccordion from '../Common/SavedShowSheetAccordion';

export default function SavedShowSheetPosts() {
    const location = useLocation();
    const dispatch = useDispatch();

    const { id } = location.state || {};

    const { savedShowSheetPosts: savedPosts, loading } = useSelector((state) => state.savedShowSheetPosts || {});

    useEffect(() => {
        if (id) {
            dispatch(saveShowSheetPost(id));
        }
    }, [dispatch, id]);

    return (
        <section className="show-sheet" id="top-show-sheet">
            <div className="show-sheet-sect">
                <div className="container">
                    {
                        savedPosts && (
                            <SavedShowSheetAccordion savedShowSheetData={savedPosts} showSheetID={id} />
                        )
                    }
                </div>
            </div>
        </section>
    );
}
