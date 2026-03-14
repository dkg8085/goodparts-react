import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../../redux/thunks/favoritesThunk";
import { fetchFavoritePostList } from "../../redux/thunks/fetchFavoritePostsThunk";
import FavoriteIconSvg from "./FavoriteIconSvg";
import Spinners from '../Common/Spinners';
import UnFavoriteIconSvg from "./UnFavouriteIcon";

export default function AddandRemoveFavorites({ itemid , categoriesName }) {

    const dispatch = useDispatch();

    const { data: favoritePosts, loading, error } = useSelector((state) => state.favoritePostList);

    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        dispatch(fetchFavoritePostList());
    }, [dispatch]);

    const isItemInFavorites = favoritePosts?.some((item) => item.ID === itemid);
    const handleFavBtnClick = async (e, postId, action) => {
        e.preventDefault();
        setIsLoading(true);
        await dispatch(toggleFavorite({ postId, action , categoriesName }));
        await dispatch(fetchFavoritePostList());
        setIsLoading(false);
    };

    return (
        <>
            {isItemInFavorites ? (
                <a
                    className="showsheet_action_btn"
                    data-id={itemid}
                    title="Remove from your Favorites"
                    onClick={(e) => handleFavBtnClick(e, itemid, "add")}
                >
                    {isLoading && (
                        <Spinners />
                    )}
                    <UnFavoriteIconSvg/>
                    Unfavorite
                </a>
            ) : (
                <a
                    className="showsheet_action_btn"
                    data-id={itemid}
                    title="Add to your Favorites"
                    onClick={(e) => handleFavBtnClick(e, itemid, "remove")}
                >
                    {isLoading && (
                        <Spinners />
                    )}
                    <FavoriteIconSvg />
                    Add to Favorites
                </a>
            )}

        </>
    );
}
