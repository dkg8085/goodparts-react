import React, { useEffect, useMemo } from "react";
import CalendarComponent from "../CalendarComponent";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  resetValues,
  toggleValue,
  selectAllValues,
  deselectAllValues,
} from "../../redux/slices/selectedValuesSlice";

export default function TaxFilter({
  sendTaxonomyId,
  onDateChange,
  onPrint,
  showDateFilter = true,
  hideDateFilter = false,
}) {
  const dispatch = useDispatch();
  const { terms, loading, error } = useSelector((state) => state.taxonomyTerms);
  const selectedValues = useSelector((state) => state.selectedValues.values);
  const location = useLocation();
  const navigate = useNavigate();

  const { clickedId, clickedCatName } = location.state || {};
  const selectedClickedId = Number(clickedId);
  const selectedTaxonomy = localStorage.getItem("selectedTaxonomy") || "";
  const assign_terms_raw = localStorage.getItem("assign_terms") || "";

  const taxonomySlug = useMemo(() => {
    return location.pathname.replace(/^\/|\/$/g, "");
  }, [location.pathname]);

  const isArchiveType = useMemo(() => {
    const archiveSlugs = ["prank-category", "listener-category"];
    return archiveSlugs.includes(taxonomySlug);
  }, [taxonomySlug]);

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

  const filteredTerms = useMemo(() => {
    if (!terms) return [];
    return terms.filter((item) => allowedTermIds.has(String(item.term_id)));
  }, [terms, allowedTermIds]);

  useEffect(() => {
    if (selectedClickedId) {
      dispatch(resetValues());
      dispatch(toggleValue(selectedClickedId));
      navigate(`/${selectedTaxonomy}`);
    }
  }, [selectedClickedId, dispatch, navigate]);

  useEffect(() => {
    if (clickedCatName && terms?.length > 0) {
      const clickedTerm = terms.find((item) => item?.name === clickedCatName);
      if (clickedTerm) {
        dispatch(resetValues());
        dispatch(toggleValue(clickedTerm?.term_id));
        navigate(`/${selectedTaxonomy}`);
      }
    }
  }, [clickedCatName, terms, dispatch, navigate]);

  const handleTermsClick = (value) => {
    dispatch(toggleValue(value));
  };

  const handleSelectAll = (event) => {
    event.preventDefault();
    if (filteredTerms.length > 0) {
      const allTermIds = filteredTerms.map((item) => item.term_id);
      dispatch(selectAllValues(allTermIds));
    }
  };

  const handleDeselectAll = (event) => {
    event.preventDefault();
    dispatch(deselectAllValues());
  };

  useEffect(() => {
    sendTaxonomyId(selectedValues);
  }, [selectedValues, sendTaxonomyId]);

  useEffect(() => {
    return () => {
      dispatch(resetValues());
    };
  }, [dispatch]);

  return (
    <section className="tx-filter-wrap">
      <div className="container">
        {!loading && !error && filteredTerms.length > 0 && (
          <div className="row">
            <div className="col-8">
              <div className="facetwp-facet facetwp-facet-prep_basic facetwp-type-checkboxes">
                {filteredTerms.map((item, index) => (
                  <div
                    className={`facetwp-checkbox ${selectedValues.includes(item.term_id) ? "selected" : ""}`}
                    data-value={item.term_id}
                    key={index}
                    onClick={() => handleTermsClick(item.term_id)}
                  >
                    <span className="facetwp-display-value">{item.name}</span>
                    <span
                      className="facetwp-counter"
                      style={{ display: "none" }}
                    >
                      (122)
                    </span>
                  </div>
                ))}

                {!isArchiveType && (
                  <>
                    <div
                      className="facetwp-checkbox select_all"
                      onClick={handleSelectAll}
                    >
                      <a href="#">Select All</a>
                    </div>
                    <div
                      className="facetwp-checkbox deselect_all"
                      onClick={handleDeselectAll}
                    >
                      <a href="#">Deselect All</a>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 👇 Conditionally render calendar */}
            {showDateFilter && !hideDateFilter && (
              <div className="col-4">
                <div className="calender-wrapper calender">
                  <CalendarComponent onDateChange={onDateChange} />
                  <div className="prep-page-print" onClick={onPrint}>
                    <div
                      className="printomatic pom-small"
                      id="id6041"
                      data-print_target=".entry-content"
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {!loading && !error && filteredTerms.length === 0 && (
          <div className="row">
            <div className="col-12">
              <p>No terms available for this category.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
