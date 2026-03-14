import React, { useEffect, useRef } from "react"; // added useRef
import { useDispatch, useSelector } from "react-redux";
import { fetchPrepSection } from "../../redux/thunks/prepSectionThunks";
import { useNavigate } from "react-router-dom"; // already imported
import { MoonLoader } from "react-spinners";

const PrepHomeFeatures = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, status, error } = useSelector((state) => state.prepSection);
  const user_role = localStorage.getItem("user_role") || "";
  
  const assignTaxonomies = JSON.parse(localStorage.getItem('assign_taxonomies') || '[]');

  // Ref for the search input
  const searchInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchPrepSection());
  }, [dispatch]);

  const handleRedirect = (taxonomy) => {
    if (!taxonomy) return;

    localStorage.setItem("selectedTaxonomy", taxonomy);

    const selectedTaxonomy = localStorage.getItem("selectedTaxonomy") || "";
    let assignTaxonomyName = "";
    let assignTaxonomyData =
      JSON.parse(localStorage.getItem("assign_taxonomies")) || [];

    if (selectedTaxonomy !== "") {
      assignTaxonomyName = selectedTaxonomy;
    } else if (assignTaxonomyData.length > 0) {
      localStorage.setItem("selectedTaxonomy", assignTaxonomyData[0]);
      assignTaxonomyName = assignTaxonomyData[0];
    }

    navigate(`/${assignTaxonomyName}`);
  };

  // Handle click on the search input – navigate to advanced search with the current keyword
  const handleSearchInputClick = () => {
    if (searchInputRef.current) {
      const keyword = searchInputRef.current.value;
      navigate(`/advanced-search/?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  const isAdmin = user_role.includes("administrator");
  const visibleItems = isAdmin 
    ? items 
    : items.filter(item => assignTaxonomies.includes(item.prep_taxonomies));

  if (status === "loading") {
    return (
      <div className="loader-overlay">
        <MoonLoader color="#15273B" size={50} />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="loader-wrapper">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* ⭐ SEARCH – entire input is now clickable and redirects */}
      <div className="container">
        <div className="prep_search">
          <div className="prep_search-wrap">
            <form
              role="search"
              method="get"
              className="search-form"
              action="/advanced-search/"
            >
              <input
                ref={searchInputRef}
                type="search"
                className="search-field"
                autoComplete="off"
                placeholder="Advanced Search"
                name="keyword"
                readOnly // makes the input non‑editable – clicking it always triggers the redirect
                onClick={handleSearchInputClick} // redirect on any click
              />
              <button type="submit" className="search-submit">
                <img
                  src="/assets/images/magnifier.svg"
                  alt="Search"
                  className="search-icon"
                />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="box-wrapper">
        <div className="box-container">
          <div className="row">
            {visibleItems.map((feature, index) => (
              <div className="box-term-item" key={index}>
                <div className="box-term-card"
                  onClick={() => handleRedirect(feature.prep_taxonomies)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="box_content_wrapper">
                    <div className="term_head">
                      <div className="icons">
                        <img
                          src={feature.icon_url}
                          width="25"
                          alt={feature.content_title}
                        />
                      </div>
                      <div className="heading">
                        <h4>{feature.taxonomy_title}</h4>
                      </div>
                    </div>

                    <div className="bucketdesc">
                      <h4>{feature.content_title}</h4>
                      <div
                        className="nb_term_post"
                        dangerouslySetInnerHTML={{
                          __html: feature.content_description,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ⭐ BOTTOM */}
      <div className="bottom-wrapper">
        <img
          src="/assets/images/pattern-seprator.svg"
          alt="pattern"
          className="search-icon"
        />
      </div>

      <div className="bottom-btn">
        <div className="backto-top">
          <a href="#top">Back to top</a>
        </div>
      </div>
    </>
  );
};

export default PrepHomeFeatures;