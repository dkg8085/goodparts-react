import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaxonomyPosts, fetchTermPosts } from "../../redux/thunks/taxonomyThunks";
import { fetchArchivePosts } from "../../redux/thunks/archiveThunks";
import { fetchTaxonomyTerms } from "../../redux/thunks/taxonomyTermsThunk";
import TaxFilter from "./TaxFilter";
import MediaList from "./MediaList";
import ScriptList from "./ScriptList";
import PostIconSvg from "./PostIconSvg";
import { MoonLoader } from "react-spinners";
import AddandRemoveShowSheet from "./AddandRemoveShowSheet";
import AddandRemoveFavorites from "./AddandRemoveFavorites";
import ManageShowSheet from "./ManageShowSheet";
import { printPosts } from "../../services/printPost";

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

export default function TaxonomyPosts() {
  const printRef = useRef();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux state
  const taxonomyPostsState = useSelector((state) => state.taxonomyPosts);
  const archivePostsState = useSelector((state) => state.archivePosts);
  const selectedValues = useSelector((state) => state.selectedValues.values);

  const [taxonomyIds, setTaxonomyIds] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const currentPath = location.pathname;
  const cleanPath = currentPath.replace(/^\/|\/$/g, "");
  const taxonomySlug = cleanPath.split("/")[0];

  const isArchiveType = useMemo(() => {
    const archiveSlugs = ["prank-category", "listener-category"];
    return archiveSlugs.includes(taxonomySlug);
  }, [taxonomySlug]);

  const assign_terms_raw = localStorage.getItem("assign_terms") || "";
  const allowedTermIds = useMemo(() => {
    try {
      const assignTerms = JSON.parse(assign_terms_raw);
      const idsForSlug = assignTerms[taxonomySlug] || [];
      return new Set(idsForSlug.map(String));
    } catch (e) {
      console.error("Failed to parse assign_terms", e);
      return new Set();
    }
  }, [assign_terms_raw, taxonomySlug]);

  const TABLOID_TERM_ID = 71;
  const isTabloidOnly = useMemo(() => {
    return selectedValues.length === 1 && selectedValues[0] === TABLOID_TERM_ID;
  }, [selectedValues]);

  const handleDateChange = (date) => {
    setSelectedDate(new Date(date).toISOString().split("T")[0]);
  };

  const handleTaxonomyId = useCallback((ids) => {
    setTaxonomyIds([ids]);
  }, []);

  const handlePrint = () => {
    printPosts(printRef);
  };

  const selectedTaxonomy = localStorage.getItem("selectedTaxonomy");
  let assignTaxonomyName = selectedTaxonomy || null;
  if (!assignTaxonomyName) {
    const assignTaxonomy = localStorage.getItem("assign_taxonomies");
    const assignTaxonomyData = assignTaxonomy
      ? JSON.parse(assignTaxonomy)
      : null;
    assignTaxonomyName = assignTaxonomyData?.[0] || null;
  }

  useEffect(() => {
    if (assignTaxonomyName) {
      dispatch(fetchTaxonomyTerms(assignTaxonomyName));
    }
  }, [assignTaxonomyName, dispatch]);

  useEffect(() => {
    if (!taxonomySlug) return;

    if (isArchiveType) {
      dispatch(
        fetchArchivePosts(
          taxonomySlug,
          currentPage,
          itemsPerPage,
          selectedValues,
        ),
      );
    } else {
      if (isTabloidOnly) {
        dispatch(fetchTermPosts({ termId: TABLOID_TERM_ID }));
      } else {
        dispatch(fetchTaxonomyPosts(selectedDate));
      }
    }
  }, [
    taxonomySlug,
    isArchiveType,
    selectedDate,
    selectedValues,
    currentPage,
    isTabloidOnly,
    dispatch,
  ]);

  useEffect(() => {
    if (isArchiveType) {
      setCurrentPage(1);
    }
  }, [selectedValues, isArchiveType]);

  const isLoading = isArchiveType
    ? archivePostsState.loading
    : taxonomyPostsState.loading;
  const error = isArchiveType
    ? archivePostsState.error
    : taxonomyPostsState.error;

  // Compute displayed posts using useMemo – avoids filtering while loading
  const displayedPosts = useMemo(() => {
    if (isLoading) return []; // no filtering during load

    const postsData = isArchiveType
      ? archivePostsState.posts || []
      : taxonomyPostsState.posts?.data || [];

    if (isArchiveType) {
      return postsData; // archive already paginated and filtered
    }

    // Client‑side filtering for non‑archive
    if (!postsData.length) return [];

    if (taxonomyIds[0]?.length > 0) {
      return postsData.filter((item) =>
        Array.isArray(item.categories) &&
        item.categories.some((category) =>
          taxonomyIds[0]
            ?.map(String)
            .includes(String(category.term_taxonomy_id))
        )
      );
    } else {
      return postsData.filter((item) =>
        Array.isArray(item.categories) &&
        item.categories.some((category) =>
          allowedTermIds.has(String(category.term_taxonomy_id))
        )
      );
    }
  }, [
    isLoading,
    isArchiveType,
    archivePostsState.posts,
    taxonomyPostsState.posts,
    taxonomyIds,
    allowedTermIds,
  ]);

  const posts = displayedPosts;
  const pagination = isArchiveType ? archivePostsState.pagination : null;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleArchiveTermChange = useCallback(() => {}, []);

  return (
    <>
      <TaxFilter
        sendTaxonomyId={
          isArchiveType ? handleArchiveTermChange : handleTaxonomyId
        }
        onDateChange={handleDateChange}
        onPrint={handlePrint}
        selectedTermIds={isArchiveType ? selectedValues : taxonomyIds[0] || []}
        showDateFilter={!isArchiveType}
        hideDateFilter={isTabloidOnly}
      />

      {isLoading ? (
        <div className="loader-overlay">
          <MoonLoader color="#15273B" loading={isLoading} size={50} />
        </div>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <section className="preps_taxonomy_posts" ref={printRef}>
          <div className="container">
            <div className="row">
              {posts.length > 0 ? (
                posts.map((item) => {
                  // Build unique media list (unchanged)
                  const uniqueMedia = [];
                  const seenUrls = new Set();
                  (item.media_post_data || []).forEach((media) => {
                    const primaryUrl =
                      media.media_url || media.media_upload_url || "";

                    if (media.type === "embed") {
                      uniqueMedia.push(media);
                    } else if (primaryUrl && !seenUrls.has(primaryUrl)) {
                      seenUrls.add(primaryUrl);
                      uniqueMedia.push(media);
                    }
                  });

                  const mediaToShow =
                    taxonomySlug === "listener-category"
                      ? uniqueMedia.slice(0, 1)
                      : uniqueMedia;

                  const baseLink = item.post_type
                    ? `/${item.post_type}/${item.slug}`
                    : `/${item.slug}`;
                  const categoryParam = item.categories?.length
                    ? `?category=${encodeURIComponent(
                        item.categories.map((cat) => cat.name).join(","),
                      )}`
                    : "";
                  const postLink = baseLink + categoryParam;

                  const isPhoneJacks = item.categories?.some(
                    (cat) => cat.slug === "phone-jacks"
                  );
                  const isComedyCalls = item.categories?.some(
                    (cat) => cat.slug === "comedy-calls"
                  );

                  const underline = isArchiveType && !isComedyCalls;

                  return (
                    <div className="tx-page-items post col-12" key={item.ID}>
                      <div className="tx-page-items-wrap">
                        <div className="texo-list-box post-box">
                          <div className="post-title">
                            <a href={postLink} rel="noopener noreferrer">
                              <h2>
                                {!isArchiveType && <PostIconSvg />}
                                {item.title}
                              </h2>
                            </a>
                          </div>
                          <div className="post_cate_name">
                            <span className="post_cate_icon">
                              <img
                                src="/assets/images/Rectangle_cate_img.svg"
                                alt="Category Icon"
                              />
                            </span>
                            {item.categories
                              ?.map((cat) => cat.name)
                              .join(", ") || ""}
                          </div>
                          <div className="post-content full-length">
                            <div className="post-content-wrap">
                              <div className="prep-content-des">
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: addTargetBlankToLinks(
                                      item.custom_fields?.prep_content ||
                                        item.content,
                                    ),
                                  }}
                                />
                              </div>

                              {!isPhoneJacks && (
                                <div className="post-media-list">
                                  {item.custom_fields?.media_list_items
                                    ?.length > 0 &&
                                    mediaToShow?.map((media, index) => (
                                      <MediaList
                                        key={index}
                                        mediaList={media}
                                        hideDownload={isArchiveType}
                                        underline={underline}
                                      />
                                    ))}
                                  {item.custom_fields?.add_script?.[0] ===
                                    "yes" && <ScriptList scriptList={item} />}
                                </div>
                              )}
                            </div>
                            <div className="post-bottom btns-wrap">
                              <div className="post-btns">
                                <AddandRemoveShowSheet itemid={item.ID} />
                                <ManageShowSheet itemid={item.ID} />
                                {!isArchiveType && (
                                  <AddandRemoveFavorites
                                    itemid={item.ID}
                                    categoriesName={item.categories?.[0]?.name}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="m-15">Sorry, no posts matched your criteria</p>
              )}
            </div>

            {isArchiveType && pagination?.total_pages > 1 && (
              <div className="cust-page-pagination">
                <div className="pagination">
                  <a
                    className="prev"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </a>
                  <span>
                    Page {currentPage} of {pagination.total_pages}
                  </span>
                  <a
                    className="next"
                    disabled={currentPage === pagination.total_pages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}