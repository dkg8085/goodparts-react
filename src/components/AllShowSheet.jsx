import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userShowSheet } from "../redux/thunks/UserShowSheetThunk";
import { Link, useNavigate } from "react-router-dom";
import { MoonLoader } from "react-spinners";
import Spinners from '././Common/Spinners'
import { deleteSavedShowSheet } from '../redux/thunks/deleteSavedShowSheetThunk'

export default function AllShowSheet() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loadingState, setLoadingState] = useState({});

    const { showSheetPosts, loading } = useSelector((state) => state.showSheetPosts || {});

    const handleShowSheetClick = (e, item) => {
        e.preventDefault();

        try {
            const link = item.title;

            const slug = link.split('/').filter(Boolean).pop();

            navigate(`/prep-showsheet/${slug}`, { state: { id: item.id } });

        } catch (error) {
            console.error("Error processing show sheet link:", error);
        }
    };

    const handleShowSheetDelete = (e, id) => {
        e.preventDefault();
        setLoadingState((prev) => ({ ...prev, [id]: true }));
        dispatch(deleteSavedShowSheet({ id }))
            .unwrap()
            .then(() => {
                dispatch(userShowSheet());
                setLoadingState((prev) => ({ ...prev, [id]: false }));
            })
            .catch((error) => {
                console.error('Deletion failed:', error);
                setLoadingState((prev) => ({ ...prev, [id]: false }));
            });
    };

    useEffect(() => {
        dispatch(userShowSheet());
    }, [dispatch]);

    return (
        <>
            <section className="all_show_sheet">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="title_show_sheet">
                                <h2>
                                    show sheets
                                </h2>
                            </div>
                            <div className="show_sheet_post-lists">
                                <ul>
                                    {loading ? (
                                        <div className="loader-overlay">
                                            <MoonLoader color="#15273B" loading={loading} size={50} />
                                        </div>
                                    ) : showSheetPosts?.data?.length > 0 ? (
                                        showSheetPosts.data.map((item) => (
                                            <li key={item.id} className="showsheet-list">
                                                <div className="titlewrap">
                                                    <Link to={item.link} data-id={item.id} onClick={(e) => handleShowSheetClick(e, item)}>
                                                        {item.title}
                                                    </Link>
                                                </div>
                                                <div className="actionwrap">
                                                    <Link to={item.link} data-id={item.id} onClick={(e) => handleShowSheetClick(e, item)}>
                                                        Load Show Sheet
                                                    </Link>
                                                    <Link to='#' data-id={item.id} onClick={(e) => handleShowSheetDelete(e, item.id)}>
                                                        {loadingState[item.id] && (
                                                            <Spinners />
                                                        )}
                                                        Delete Show Sheet
                                                    </Link>
                                                </div>

                                            </li>
                                        ))
                                    ) : (
                                        <p>No show sheets available.</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </>
    )
}