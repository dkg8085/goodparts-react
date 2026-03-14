import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useLocation } from "react-router-dom";
import { fetchSinglePost } from "../../redux/thunks/singlePostThunk";
import MediaList from "./MediaList";
import ScriptList from "./ScriptList";
import PostIconSvg from "./PostIconSvg";
import { MoonLoader } from "react-spinners";
import AddandRemoveShowSheet from "./AddandRemoveShowSheet";
import AddandRemoveFavorites from "./AddandRemoveFavorites";
import ManageShowSheet from "./ManageShowSheet";
import { useNavigate } from "react-router-dom";

/**
 * Safely adds target="_blank" and rel="noopener noreferrer" to every anchor tag
 * inside an HTML string. Handles arrays, null, undefined, and non‑strings.
 * @param {string|string[]|*} htmlInput - The HTML content (string or array)
 * @returns {string} - Processed HTML with all links opened in new tabs
 */
function addTargetBlankToLinks(htmlInput) {
  // If it's an array, take the first element (assuming it's the HTML string)
  let htmlString = Array.isArray(htmlInput) ? htmlInput[0] : htmlInput;

  // If it's not a string, return empty string
  if (typeof htmlString !== "string") return "";

  // Replace <a> tags, preserving existing attributes.
  // If a target attribute already exists, it is not overridden.
  return htmlString.replace(
    /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1([^>]*)>/gi,
    (match, quote, url, rest) => {
      if (/target\s*=/i.test(rest)) return match; // leave unchanged if target already exists
      return `<a href=${quote}${url}${quote} target="_blank" rel="noopener noreferrer"${rest}>`;
    },
  );
}

export default function SinglePostLayout() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");
  const dispatch = useDispatch();
  const { post, loading, error } = useSelector((state) => state.singlePost);
  const [dataLoaded, setDataLoaded] = useState(false);

  let assignTaxonomyData = [];
  try {
    assignTaxonomyData =
      JSON.parse(localStorage.getItem("assign_taxonomies")) || [];
    if (!Array.isArray(assignTaxonomyData)) throw new Error();
  } catch {
    assignTaxonomyData = [];
  }

  const selectedTaxonomy = localStorage.getItem("selectedTaxonomy");
  let assignTaxonomyName = selectedTaxonomy || null;
  if (!assignTaxonomyName) {
    const assignTaxonomy = localStorage.getItem("assign_taxonomies");
    const assignTaxonomyData = assignTaxonomy
      ? JSON.parse(assignTaxonomy)
      : null;
    assignTaxonomyName = assignTaxonomyData?.[0] || null;
  }

  const fetchData = async () => {
    if (slug) {
      const result = await dispatch(fetchSinglePost({ slug, category }));
      if (result.meta.requestStatus === "fulfilled") {
        setDataLoaded(true);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, slug, category]);

  const fetchShowSheetPosts = () => {
    setDataLoaded(true);
    fetchData();
    setDataLoaded(false);
  };

  const handleCategoryClick = (e) => {
    e.preventDefault();
    console.log(post?.category);

    // navigate(`/${assignTaxonomyName}`, {
    //   state: { clickedCatName: post?.category },
    // });
  };

  return (
    <>
      <section id="g-page-surround" className="single-post-layout single-page">
        <div className="container">
          <div className="back-url">
            <Link to={`/${assignTaxonomyName}`}>
              RETURN TO {assignTaxonomyName}
            </Link>
          </div>
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
          {!dataLoaded ? (
            <div className="loader-overlay">
              <MoonLoader color="#15273B" loading size={50} />
            </div>
          ) : (
            <div className="us-perp-content">
              <div className="usprep-head row">
                <div className="banner-meta col-12">
                  <div className="post-meta row">
                    <div className="meta-publish col-12">
                      <div className="meta-icon">
                        <PostIconSvg />
                      </div>
                      <div className="usprep-date">
                        <span>PUBLISHED </span> {post?.post_date}
                      </div>
                      <div className="usprep-date">
                        <span>UPDATED </span> {post?.post_modified}
                      </div>
                    </div>

                    <div className="post-term col-12">
                      {post?.categories?.map(
                        (categoryItem, index) =>
                          categoryItem.name &&
                          categoryItem.name.trim() !== "" && (
                            <React.Fragment key={index}>
                              <Link
                                to="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // Navigate using the clicked category name
                                  navigate(`/${assignTaxonomyName}`, {
                                    state: {
                                      clickedCatName: categoryItem.name,
                                    },
                                  });
                                }}
                                className="category-link"
                              >
                                {categoryItem.name}
                              </Link>
                              {/* Add a separator between categories (optional) */}
                              {index < post.categories.length - 1 && (
                                <span className="category-separator">, </span>
                              )}
                            </React.Fragment>
                          ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="usprep-body row tx-page-items">
                <div className="usprep-title col-12">
                  <h2>{post?.title}</h2>
                </div>
                <div className="usprep-post-content col-12">
                  <div className="post-content-wrap col-12">
                    <p
                      dangerouslySetInnerHTML={{
                        __html:
                          addTargetBlankToLinks(
                            post?.custom_fields?.prep_content,
                          ) || "No content available",
                      }}
                    ></p>
                  </div>
                  <div className="post-media-list">
                    {post?.custom_fields?.media_list_items?.length > 0 &&
                      post?.media_post_data?.map((media, index) => (
                        <MediaList key={index} mediaList={media} />
                      ))}
                    {post?.custom_fields?.add_script?.[0] === "yes" && (
                      <ScriptList scriptList={post} />
                    )}
                  </div>
                  <div className="post-btns">
                    <AddandRemoveShowSheet itemid={post?.ID} />
                    <ManageShowSheet itemid={post?.ID} />
                    <AddandRemoveFavorites
                      itemid={post?.ID}
                      categoriesName={post?.category}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="backto-top">
            <a href="#g-page-surround"> Back to top </a>
          </div>
        </div>
      </section>
    </>
  );
}
