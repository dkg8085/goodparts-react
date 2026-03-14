import React, { useState, useEffect } from "react";
import PostIconSvg from "./Common/PostIconSvg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavoritePostList } from "../redux/thunks/fetchFavoritePostsThunk";
import { MoonLoader } from "react-spinners";
import FavoriteIconSvg from "./Common/FavoriteIconSvg";
import { toggleFavorite } from "../redux/thunks/favoritesThunk";
import MediaList from "./Common/MediaList";
import ScriptList from "./Common/ScriptList";
import AddandRemoveFavorites from "./Common/AddandRemoveShowSheet";
import ManageShowSheet from "./Common/ManageShowSheet";
import Spinners from './Common/Spinners'

const Favorites = () => {
    const dispatch = useDispatch();
    const { data, loading } = useSelector((state) => state.favoritePostList);
    const [favPostList, setFavPostList] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchFavoritePostList());
    }, [dispatch]);

    useEffect(() => {
        if (data) {
            setFavPostList(data);
        }
    }, [data]);

    const handleFavBtnClick = async (e, postId, action, categoriesName) => {
        e.preventDefault();
        setIsLoading(true);
        await dispatch(toggleFavorite({ postId, action, categoriesName }));
        setIsLoading(false);
        await dispatch(fetchFavoritePostList());
    };

    let assignTaxonomyData = [];
    try {
        assignTaxonomyData = JSON.parse(localStorage.getItem("assign_taxonomies")) || [];
        if (!Array.isArray(assignTaxonomyData)) throw new Error();
    } catch {
        assignTaxonomyData = [];
    }

    const assignTaxonomyName = assignTaxonomyData[0] || null;

    return (
        <>
            <section className="favorite-main-wrap">
                <div className="container">
                    <div className="row fav-wrapper">
                        {loading ? (
                            <div className="loader-overlay">
                                <MoonLoader color="#15273B" loading={loading} size={50} />
                            </div>
                        ) : favPostList.length > 0 ? (
                            favPostList.map((post) => (
                                <div key={post?.ID} className="tx-page-items-wrap">
                                    <div className="texo-list-box post-box">
                                        <div className="post-title">
                                            <Link
                                                to={`/${post?.slug}${post?.category ? `?category=${post.category}` : ""
                                                    }`}
                                            >
                                                <h2>
                                                    <PostIconSvg />
                                                    {post?.title}
                                                </h2>
                                            </Link>
                                        </div>

                                        {post?.category && post.category.trim() !== "" && (
                                            <div className="post-cat">
                                                <span>{post.category}</span>
                                            </div>
                                        )}

                                        <div className="post-content full-length">
                                            <div className="post-content-wrap">
                                                <div className="prep-content-des">
                                                    <p
                                                        dangerouslySetInnerHTML={{
                                                            __html: post?.custom_fields?.prep_content || "",
                                                        }}
                                                    ></p>
                                                </div>
                                                <div className="post-media-list">
                                                    {post?.custom_fields?.media_list_items?.length > 0 &&
                                                        post?.media_post_data?.map((media) => (
                                                            <MediaList key={media.id} mediaList={media} />
                                                        ))}
                                                    {post?.custom_fields?.add_script?.[0] === "yes" && (
                                                        <ScriptList scriptList={post} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="search-button">
                                            <AddandRemoveFavorites itemid={post?.ID} />
                                            <ManageShowSheet itemid={post?.ID} />
                                            <a
                                                className="showsheet_action_btn"
                                                data-id={post?.ID}
                                                title="Remove from your Favorites"
                                                onClick={(e) => handleFavBtnClick(e, post?.ID, "add", post?.category)}
                                            >
                                                {isLoading && (
                                                    <Spinners />
                                                )}
                                                <FavoriteIconSvg />
                                                Unfavorite
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Sorry, no favorites matched your criteria.</p>
                        )}
                    </div>
                </div>
            </section>
        </>

    );
};

export default Favorites;
