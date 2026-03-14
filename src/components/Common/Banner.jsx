import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Banner() {
  const [logoSrc, setLogoSrc] = useState("");
  const location = useLocation();

  const { pathname, search } = location;
  const pathSegments = pathname.split("/").filter(Boolean);

  const isPrepShowSheet = pathSegments[0] === "prep-showsheet";
  const dynamicSegment = isPrepShowSheet ? pathSegments[1] : null;

  const isAdvancedSearch = pathname === "/advanced-search";
  const isAccount = pathname === "/account";
  const isContactUs = pathname === "/contact";
  const isShowSheet = pathname === "/show-sheet";
  const isFavorites = pathname === "/favorites";
  const isAllShowSheet = pathname === "/prep-showsheet";
  const isPermission = pathname === "/permission";
  const isPrepHome = pathname === "/";

  const isSlugWithCategory =
    pathSegments.length === 1 && search.includes("category=");

  // 🔥 get dynamic banner title if path not matched
  const getDynamicTitle = () => {
    if (pathSegments.length === 0) return "SHOW SHEETS";

    const lastSegment = pathSegments[pathSegments.length - 1];
    if (lastSegment == "prep-comedy") {
      const lastSegment = "COMEDY";
      return lastSegment;
    } else {
      return lastSegment
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }


  };

  useEffect(() => {
    const storedData = localStorage.getItem("taxonomy_settings");
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        if (Array.isArray(data) && data.length > 0) {
          const settings = data[0];
          setLogoSrc(settings?.logo_image_url || "");
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }
  }, []);

  if (isSlugWithCategory) return null;

  return (
    <div className="alignfull banner">
      <div className="row">
        {isAdvancedSearch ? (
          <div className="banner-content title">
            <h1 className="page-title">ADVANCED SEARCH</h1>
          </div>
        ) : isContactUs ? (
          <div className="banner-content title">
            <h1 className="page-title">Contact</h1>
          </div>
        ) : isPrepHome ? (
          <div className="banner-content title">
            <h1 className="page-title">PREP HOME</h1>
          </div>
        ) : isShowSheet ? (
          <div className="banner-content title">
            <h1 className="page-title">SHOW SHEET</h1>
          </div>
        ) : isFavorites ? (
          <div className="banner-content title">
            <h1 className="page-title">FAVORITES</h1>
          </div>
        ) : isPermission ? (
          <div className="banner-content title">
            <h1 className="page-title">PERMISSION</h1>
          </div>
        ) : isAllShowSheet ? (
          <div className="banner-content title">
            <h1 className="page-title">PREP SHOWSHEET</h1>
          </div>
        ) : isPrepShowSheet && dynamicSegment ? (
          <div className="banner-content title">
            <h1 className="page-title">PREP SHOWSHEET</h1> {/* Static title */}
          </div>
        ) : isAccount ? (
          <div className="banner-content title">
            <h1 className="page-title">Account</h1>
          </div>
        ) : (
          <div className="banner-content title">
            <h1 className="page-title">{getDynamicTitle()}</h1>
          </div>
        )}
      </div>
    </div>
  );
}