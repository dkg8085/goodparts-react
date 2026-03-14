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

function addTargetBlankToLinks(htmlInput) {
  let htmlString = Array.isArray(htmlInput) ? htmlInput[0] : htmlInput;
  if (typeof htmlString !== "string") return "";
  return htmlString.replace(
    /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1([^>]*)>/gi,
    (match, quote, url, rest) => {
      if (/target\s*=/i.test(rest)) return match;
      return `<a href=${quote}${url}${quote} target="_blank" rel="noopener noreferrer"${rest}>`;
    },
  );
}

export default function SinglePost() {
  const { slug, postType } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");
  const dispatch = useDispatch();
  const { post, loading, error } = useSelector((state) => state.singlePost);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fallback taxonomy name from localStorage
  const assignTaxonomyData = (() => {
    try {
      const data = JSON.parse(localStorage.getItem("assign_taxonomies")) || [];
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  })();

  const selectedTaxonomy = localStorage.getItem("selectedTaxonomy");
  const fallbackTaxonomy = selectedTaxonomy || assignTaxonomyData?.[0] || null;

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

  // Determine if this post belongs to an archive type (prank-category or listener-category)
  const isArchiveType = (() => {
    const archiveSlugs = ["prank-category", "listener-category"];
    if (post?.categories && post.categories.length > 0) {
      const taxSlug = post.categories[0].taxonomy_slug;
      return archiveSlugs.includes(taxSlug);
    }
    return false;
  })();

  // Build the back link using the post's actual taxonomy (if available), otherwise fallback
  const backLink = post?.categories?.[0]?.taxonomy_slug
    ? `/${post.categories[0].taxonomy_slug}`
    : `/${fallbackTaxonomy}`;

  const handleCategoryClick = (e) => {
    e.preventDefault();
    navigate(backLink, {
      state: { clickedCatName: post?.categories?.[0]?.name },
    });
  };

  // Check if this post has pulse fields (prank posts)
  const hasPulseFields = post?.custom_fields?.pulse_file_path?.[0];

  return (
    <section id="g-page-surround" className="single-post-layout single-page">
      <div className="container">
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
                    <div className="meta-icon"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="usprep-body row tx-page-items">
              <div className="usprep-title col-12">
                <h2>{post?.title}</h2>
              </div>
              <div className="usprep-post-content col-12">
                {/* Display custom prep_content if available (for all posts) */}
                {post?.custom_fields?.prep_content && (
                  <div className="post-content-wrap col-12">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: addTargetBlankToLinks(
                          post.custom_fields.prep_content,
                        ),
                      }}
                    />
                  </div>
                )}

                {/* For pulse posts (prank), show response line and script links */}
                {hasPulseFields && (
                  <div className="pulse-links">
                    {post.custom_fields.pulse_resp_media?.[0] && (
                      <p>
                        <strong>Response line:</strong>{" "}
                        <a
                          href={post.custom_fields.pulse_resp_media[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            textDecoration: "underline",
                            color: "inherit",
                          }}
                        >
                          Response line
                        </a>
                      </p>
                    )}
                    {post.custom_fields.pulse_media_script?.[0] && (
                      <p>
                        <strong>Download script:</strong>{" "}
                        <a
                          href={post.custom_fields.pulse_media_script[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            textDecoration: "underline",
                            color: "inherit",
                          }}
                        >
                          Script
                        </a>
                      </p>
                    )}
                  </div>
                )}

                {/* Static PREP CONTENT label for pulse posts */}
                {hasPulseFields && (
                  <div
                    className="prep-content-label"
                    style={{ marginTop: "20px", fontWeight: "bold" }}
                  >
                    PREP CONTENT
                  </div>
                )}

                {/* Audio / media section */}
                <div className="post-media-list">
                  {/* Case 1: Pulse posts – use constructed MediaList */}
                  {hasPulseFields &&
                    post.custom_fields.pulse_file_path?.[0] && (
                      <MediaList
                        mediaList={{
                          title: post.title,
                          media_url: post.custom_fields.pulse_file_path[0],
                          clip_length:
                            post.custom_fields.pulse_length?.[0] || null,
                          type: "audio",
                        }}
                        hideDownload={isArchiveType}
                      />
                    )}

                  {/* Case 2: Non‑pulse posts */}
                  {!hasPulseFields && (
                    <>
                      {/* For listener‑category, prefer content over media_post_data */}
                      {isArchiveType ? (
                        // Listener‑category
                        post?.content ? (
                          // Show content (with icon) if it exists
                          <div className="post-content-wrap col-12">
                            <p
                              dangerouslySetInnerHTML={{
                                __html: addTargetBlankToLinks(post.content),
                              }}
                            />
                          </div>
                        ) : (
                          // Fallback to simple links if no content
                          post?.media_post_data?.map((media, index) => (
                            <div key={index} className="simple-media-link">
                              <a
                                href={media.media_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  textDecoration: "underline",
                                  color: "inherit",
                                }}
                              >
                                {media.title || "Download Audio"}
                              </a>
                            </div>
                          ))
                        )
                      ) : (
                        // Non‑archive: use full MediaList player
                        post?.media_post_data?.map((media, index) => (
                          <MediaList
                            key={index}
                            mediaList={media}
                            hideDownload={isArchiveType}
                          />
                        ))
                      )}
                    </>
                  )}

                  {/* ScriptList for add_script */}
                  {post?.custom_fields?.add_script?.[0] === "yes" && (
                    <ScriptList scriptList={post} />
                  )}
                </div>

                {/* Fallback: only show main content if absolutely nothing else is shown (except for listener‑category we already handled) */}
                {!hasPulseFields &&
                  !isArchiveType &&
                  !post?.custom_fields?.prep_content &&
                  (!post?.media_post_data ||
                    post.media_post_data.length === 0) &&
                  post?.content && (
                    <div className="post-content-wrap col-12">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: addTargetBlankToLinks(post.content),
                        }}
                      />
                    </div>
                  )}

                <div className="post-btns">
                  <AddandRemoveShowSheet itemid={post?.ID} />
                  <ManageShowSheet itemid={post?.ID} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
