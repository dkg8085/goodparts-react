import React, { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { MoonLoader } from "react-spinners";
import { Link, useLocation } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import PostIconSvg from "./Common/PostIconSvg";
import MediaList from "./Common/MediaList";
import ScriptList from "./Common/ScriptList";
import AddandRemoveShowSheet from "./Common/AddandRemoveShowSheet";
import AddandRemoveFavorites from "./Common/AddandRemoveFavorites";
import ManageShowSheet from "./Common/ManageShowSheet";
import { fetchSearchTaxonomyTerms } from "../redux/thunks/searchTaxonomyTermsThunk";
import { fetchSearchPost } from "../redux/thunks/searchPostThunk";
import { clearSearchPost } from "../redux/slices/searchPostSlice";

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

export default function AdvancedSearch() {
  const dispatch = useDispatch();
  const location = useLocation();

  // Local state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isMediaChecked, setIsMediaChecked] = useState(false);
  const [dateWarning, setDateWarning] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // Get assign_terms from localStorage
  const assign_terms_raw = localStorage.getItem("assign_terms") || "";

  // Collect all term IDs from assign_terms (flatten all arrays)
  const allowedTermIds = useMemo(() => {
    try {
      const assignTerms = JSON.parse(assign_terms_raw);
      const allIds = Object.values(assignTerms).flat();
      return new Set(allIds.map(String));
    } catch (e) {
      console.error("Failed to parse assign_terms", e);
      return new Set();
    }
  }, [assign_terms_raw]);

  // Categories to exclude from the filter list
  const excludedCategoryNames = useMemo(
    () => [
      "Confession Lines",
      "Loser Line",
      "Vent Line",
      "Comedy Calls",
      "Phone Jacks",
    ],
    [],
  );

  // Redux state
  const {
    terms,
    loading: termsLoading,
    error: termsError,
  } = useSelector((state) => state.searchTaxonomyTerms);

  const {
    searchPost,
    pagination,
    loading: searchPostLoading,
    error: searchPostError,
  } = useSelector((state) => state.searchPost);

  const filteredTerms = useMemo(() => {
    if (!terms) return [];
    return terms
      .filter((item) => allowedTermIds.has(String(item.id)))
      .filter((item) => !excludedCategoryNames.includes(item.name));
  }, [terms, allowedTermIds, excludedCategoryNames]);

  useEffect(() => {
    dispatch(fetchSearchTaxonomyTerms());
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearSearchPost());
    setHasSearched(false);
  }, [dispatch]);

  // Extract keyword from URL query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keywordParam = params.get("keyword");
    if (keywordParam) {
      setSearchKeyword(keywordParam);
    }
  }, [location.search]);

  // Format date as DD-MM-YYYY
  const formatDate = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .format(date)
      .replace(/\//g, "-");
  };

  // Handle search
  const handleSearch = (page = 1) => {
    // Check date consistency first
    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      setDateWarning(true);
      return;
    }
    setDateWarning(false);

    // Check that at least one search criterion is selected
    const hasKeyword = searchKeyword.trim() !== "";
    const hasDateRange = fromDate && toDate;
    const hasCategories = selectedCategories.length > 0;
    const hasMedia = isMediaChecked;

    if (!hasKeyword && !hasDateRange && !hasCategories && !hasMedia) {
      setValidationError("Please select at least one search criteria.");
      return;
    }
    setValidationError("");

    setHasSearched(true);
    setCurrentPage(page);

    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);

    dispatch(
      fetchSearchPost({
        searchKeyword,
        fromDate: formattedFromDate,
        toDate: formattedToDate,
        selectedCategories,
        filter_media: isMediaChecked ? "yes" : "no",
        page,
        per_page: perPage,
      }),
    );
  };

  // Reset – reload page
  const handleReset = () => {
    setSearchKeyword("");
    setFromDate(null);
    setToDate(null);
    setSelectedCategories([]);
    setIsMediaChecked(false);
    setDateWarning(false);
    setHasSearched(false);
    setValidationError("");
    setCurrentPage(1);
    dispatch(clearSearchPost());
  };

  // Handle checkbox change
  const handleCategoryChange = (categoryId, taxonomy) => {
    setSelectedCategories((prev) => {
      const existingCategory = prev.find((cat) => cat.taxonomy === taxonomy);
      if (existingCategory) {
        const updatedTermIds = existingCategory.term_ids.includes(categoryId)
          ? existingCategory.term_ids.filter((id) => id !== categoryId)
          : [...existingCategory.term_ids, categoryId];

        if (updatedTermIds.length) {
          return prev.map((cat) =>
            cat.taxonomy === taxonomy
              ? { ...cat, term_ids: updatedTermIds }
              : cat,
          );
        } else {
          return prev.filter((cat) => cat.taxonomy !== taxonomy);
        }
      } else {
        return [...prev, { taxonomy, term_ids: [categoryId] }];
      }
    });
  };

  const isLoading = termsLoading || searchPostLoading;

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.total_pages || 1)) {
      handleSearch(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="advanced-search" id="ad-search">
      <div className="container">
        <div className="row">
          {/* Left column – search results */}
          <div className="col-8">
            {isLoading ? (
              <div className="loader-overlay">
                <MoonLoader color="#15273B" loading={isLoading} size={50} />
              </div>
            ) : (
              <>
                {searchPost && searchPost.length > 0 ? (
                  <>
                    {searchPost.map((post) => (
                      <div key={post.id} className="tx-page-items-wrap">
                        <div className="texo-list-box post-box">
                          <div className="post-title">
                            <Link
                              to={`/${post.slug}?category=${post.categories?.[0]?.name || ""}`}
                            >
                              <h2>
                                <PostIconSvg />
                                {post.title}
                              </h2>
                            </Link>
                          </div>

                          <div className="post-content full-length">
                            <div className="post-content-wrap">
                              <div className="prep-content-des">
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      addTargetBlankToLinks(
                                        post.meta?.prep_content,
                                      ) || "",
                                  }}
                                />
                              </div>
                              <div className="post-media-list">
                                {post.meta?.media_list_items?.length > 0 &&
                                  post.media_post_data?.map((media, idx) => (
                                    <MediaList key={idx} mediaList={media} />
                                  ))}
                                {post.meta?.add_script === "yes" && (
                                  <ScriptList scriptList={post} />
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="search-button">
                            <AddandRemoveShowSheet itemid={post.id} />
                            <ManageShowSheet itemid={post.id} />
                            <AddandRemoveFavorites
                              itemid={post.id}
                              categoriesName={post.categories?.[0]?.name}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Pagination */}
                    {pagination && pagination.total_pages > 1 && (
                      <div className="cust-page-pagination">
                        <div className="nav-links">                          
                          {currentPage > 1 && (
                            <a
                              className="prev page-numbers"
                              onClick={() => handlePageChange(currentPage - 1)}
                            >
                              Previous
                            </a>
                          )}                        
                          {currentPage > 2 && (
                            <a
                              className="page-numbers"
                              onClick={() => handlePageChange(1)}
                            >
                              1
                            </a>
                          )}                        
                          {currentPage > 3 && (
                            <span className="page-numbers dots">…</span>
                          )}                       
                          {[currentPage - 1, currentPage, currentPage + 1]
                            .filter(
                              (page) =>
                                page > 0 && page <= pagination.total_pages,
                            )
                            .map((page) =>
                              page === currentPage ? (
                                <span
                                  key={page}
                                  aria-current="page"
                                  className="page-numbers current"
                                >
                                  {page}
                                </span>
                              ) : (
                                <a
                                  key={page}
                                  className="page-numbers"
                                  onClick={() => handlePageChange(page)}
                                >
                                  {page}
                                </a>
                              ),
                            )}                          
                          {currentPage < pagination.total_pages - 2 && (
                            <span className="page-numbers dots">…</span>
                          )}                          
                          {currentPage < pagination.total_pages - 1 && (
                            <a
                              className="page-numbers"
                              onClick={() =>
                                handlePageChange(pagination.total_pages)
                              }
                            >
                              {pagination.total_pages}
                            </a>
                          )}                          
                          {currentPage < pagination.total_pages && (
                            <a
                              className="next page-numbers"
                              onClick={() => handlePageChange(currentPage + 1)}
                            >
                              Next
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p>No searches were found.</p>
                )}
              </>
            )}
          </div>

          {/* Right column – search form (unchanged) */}
          <div className="col-4">
            <div className="form-search">
              <div className="form-fields">
                <label htmlFor="keywordSearch">Search by Keyword:</label>
                <input
                  id="keywordSearch"
                  type="text"
                  placeholder="Write Keywords..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>

              <div className="date-picker">
                <div className="date-pic">
                  <label>From date:</label>
                  <div className="date-input-wrapper">
                    <DatePicker
                      selected={fromDate}
                      onChange={setFromDate}
                      dateFormat="dd-MM-yy"
                      placeholderText="DD-MM-YY"
                      isClearable
                      className="date-input"
                    />
                    <FaCalendarAlt className="calendar-icon" />
                  </div>
                </div>
                <div className="date-pic">
                  <label>To date:</label>
                  <div className="date-input-wrapper">
                    <DatePicker
                      selected={toDate}
                      onChange={setToDate}
                      dateFormat="dd-MM-yy"
                      placeholderText="DD-MM-YY"
                      isClearable
                      className="date-input"
                    />
                    <FaCalendarAlt className="calendar-icon" />
                  </div>
                </div>
              </div>
              {dateWarning && (
                <p className="ad-date-error">
                  Please select both start date and end date.
                </p>
              )}

              <div className="categories">
                <p>Choose category:</p>
                {termsLoading && <p>Loading categories...</p>}
                {termsError && (
                  <p className="error">Error loading categories</p>
                )}
                {!termsLoading && !termsError && filteredTerms.length === 0 && (
                  <p>No categories available for this section</p>
                )}
                {!termsLoading &&
                  !termsError &&
                  filteredTerms.length > 0 &&
                  filteredTerms.map((item) => (
                    <label key={item.id}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.some(
                          (cat) =>
                            cat.taxonomy === item.taxonomy_slug &&
                            cat.term_ids.includes(item.id),
                        )}
                        onChange={() =>
                          handleCategoryChange(item.id, item.taxonomy_slug)
                        }
                      />
                      {item.name}
                    </label>
                  ))}

                <label className="media-wrap-search">
                  <input
                    type="checkbox"
                    checked={isMediaChecked}
                    onChange={(e) => setIsMediaChecked(e.target.checked)}
                  />
                  Has Media (audio or video)
                </label>
              </div>

              <div className="search-button">
                <button className="do-search" onClick={() => handleSearch(1)}>
                  Search
                </button>
                <button className="reset-search" onClick={handleReset}>
                  Reset
                </button>
              </div>

              {validationError && (
                <p
                  className="validation-error"
                  style={{ color: "red", marginTop: "10px" }}
                >
                  {validationError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
