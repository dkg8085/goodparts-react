import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaxonomyPosts } from "../../redux/thunks/taxonomyThunks";
import { fetchTaxonomyTerms } from "../../redux/thunks/taxonomyTermsThunk";
import TaxFilter from "./TaxFilter";
import MediaList from "./MediaList";
import ScriptList from "./ScriptList";
import PostIconSvg from "./PostIconSvg";
import { MoonLoader } from "react-spinners";
import { toggleFavorite } from "../../redux/thunks/favoritesThunk";
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

export default function PostsWithPagination() {
  const printRef = useRef();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    posts,
    loading: postsLoading,
    error: postsError,
  } = useSelector((state) => state.taxonomyPosts);
  const {
    taxonomyTerms,
    loading: taxonomyTermsLoading,
    error: taxonomyTermsError,
  } = useSelector((state) => state.taxonomyTerms);
  const [taxonomyIds, setTaxonomyIds] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState(posts?.data || []);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const currentPath = location.pathname;
  const taxonomySlug = currentPath.replace(/^\//, "");

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
  // --- END NEW ---

  useEffect(() => {
    setFilteredPosts(posts?.data || []);
  }, [posts?.data]);

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
    if (selectedDate) {
      dispatch(fetchTaxonomyPosts(selectedDate));
    }
  }, [selectedDate, dispatch]);

  useEffect(() => {
    dispatch(fetchTaxonomyTerms(assignTaxonomyName));
  }, [dispatch]);

  useEffect(() => {
    if (taxonomyIds[0]?.length > 0) {
      setFilteredPosts(
        posts?.data?.filter(
          (item) =>
            Array.isArray(item.categories) &&
            item.categories.some((category) =>
              taxonomyIds[0]
                ?.map(String)
                .includes(String(category.term_taxonomy_id)),
            ),
        ) || [],
      );
    } else {
      setFilteredPosts(
        posts?.data?.filter(
          (item) =>
            Array.isArray(item.categories) &&
            item.categories.some((category) =>
              allowedTermIds.has(String(category.term_taxonomy_id)),
            ),
        ) || [],
      );
    }
  }, [taxonomyIds, posts?.data, allowedTermIds]);

  const isLoading = postsLoading || taxonomyTermsLoading;

  return (
    <>
      <TaxFilter
        sendTaxonomyId={handleTaxonomyId}
        onDateChange={handleDateChange}
        onPrint={handlePrint}
      />
      {isLoading ? (
        <div className="loader-overlay">
          <MoonLoader color="#15273B" loading={isLoading} size={50} />
        </div>
      ) : postsError || taxonomyTermsError ? (
        <p style={{ color: "red" }}>
          {postsError ? `Error: ${postsError}` : ""}
          {taxonomyTermsError ? `Error: ${taxonomyTermsError}` : ""}
        </p>
      ) : (
        <section className="preps_taxonomy_posts" ref={printRef}>
          <div className="container">
            <div className="row">
              {filteredPosts?.length > 0 ? (
                filteredPosts.map((item) => (
                  <div className="tx-page-items post col-12" key={item.ID}>
                    <div className="tx-page-items-wrap">
                      <div className="texo-list-box post-box">
                        <div className="post-title">
                          <a
                            href={`/${item.slug}${
                              item.categories?.length
                                ? `?category=${encodeURIComponent(
                                    item.categories
                                      .map((cat) => cat.name)
                                      .join(","),
                                  )}`
                                : ""
                            }`}
                            rel="noopener noreferrer"
                          >
                            <h2>
                              <PostIconSvg />
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
                          {item.categories?.map((cat) => cat.name).join(", ") ||
                            ""}
                        </div>
                        <div className="post-content full-length">
                          <div className="post-content-wrap">
                            <div className="prep-content-des">
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: addTargetBlankToLinks(
                                    item.custom_fields?.prep_content,
                                  ),
                                }}
                              ></p>
                            </div>
                            <div className="post-media-list">
                              {item.custom_fields?.media_list_items?.length >
                                0 &&
                                item.media_post_data?.map((media, index) => (
                                  <MediaList key={index} mediaList={media} />
                                ))}
                              {item.custom_fields?.add_script?.[0] ===
                                "yes" && <ScriptList scriptList={item} />}
                            </div>
                          </div>
                          <div className="post-bottom btns-wrap">
                            <div className="post-btns">
                              <AddandRemoveShowSheet itemid={item.ID} />
                              <ManageShowSheet itemid={item.ID} />
                              <AddandRemoveFavorites
                                itemid={item.ID}
                                categoriesName={item.categories?.[0]?.name}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="m-15">Sorry , no posts matched your criteria</p>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
