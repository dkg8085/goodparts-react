import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { staticMenu } from "../../redux/thunks/staticManueThunk";
import Menus from "./Menus";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { menusStatic, loading, error } = useSelector(
    (state) => state.staticMenus || {},
  );
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("user");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // States for settings dropdown (hover + click)
  const [isSettingsHovered, setIsSettingsHovered] = useState(false);
  const [isSettingsToggled, setIsSettingsToggled] = useState(false);
  const showSettings = isSettingsHovered || isSettingsToggled;

  let assignTaxonomyData = [];
  try {
    assignTaxonomyData =
      JSON.parse(localStorage.getItem("assign_taxonomies")) || [];
    if (!Array.isArray(assignTaxonomyData)) throw new Error();
  } catch {
    assignTaxonomyData = [];
  }

  const assignTaxonomyName = assignTaxonomyData[0] || null;

  useEffect(() => {
    if (!isLoggedIn && location.pathname !== "/") {
      navigate("/login");
    }
  }, [isLoggedIn, navigate, location]);

  useEffect(() => {
    dispatch(staticMenu());
  }, [dispatch]);

  const handleHamburgerClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    closeSettings();
    navigate("/login");
  };

  assignTaxonomyData =
    JSON.parse(localStorage.getItem("assign_taxonomies")) || [];

  const handleLogoClick = (e) => {
    e.preventDefault();
    localStorage.setItem("selectedTaxonomy", assignTaxonomyData[0]);
    localStorage.removeItem("selectedTaxonomies");
    navigate(`/`);
    // window.location.reload();
  };

  const toggleSettings = () => {
    setIsSettingsToggled(!isSettingsToggled);
  };

  const closeSettings = () => {
    setIsSettingsHovered(false);
    setIsSettingsToggled(false);
  };

  const handleStaticMenuItemClick = (url) => (e) => {
    // For internal links, navigate via react-router and close dropdown
    if (url.startsWith("/")) {
      e.preventDefault();
      closeSettings();
      navigate(url);
    } else {
      // External links: close dropdown and let browser handle
      closeSettings();
      // No need to prevent default; link will open normally
    }
  };

  return (
    <>
      <header id="#top">
        <div className="container">
          <div className="row">
            <div className="col-25 header-col">
              <div className="site-logo">
                <Link href="#" onClick={handleLogoClick}>
                  <img
                    src="/assets/images/header-logo.svg"
                    alt="Site Logo"
                    className="logo"
                  />
                </Link>
              </div>
            </div>

            <div className="col-50 header-col play-icon-wrap">
              <div className="play-icon">
                  <Link to="/tutorials">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="56"
                    height="56"
                    viewBox="0 0 56 56"
                  >
                    <defs>
                      <clipPath id="clip-path">
                        <rect
                          id="Rectangle_11"
                          data-name="Rectangle 11"
                          width="56"
                          height="56"
                          transform="translate(0)"
                          fill="#009795"
                        />
                      </clipPath>
                    </defs>
                    <g
                      id="Group_76"
                      data-name="Group 76"
                      transform="translate(0.19 -0.06)"
                    >
                      <g
                        id="Group_15"
                        data-name="Group 15"
                        transform="translate(-0.19 0.06)"
                        clipPath="url(#clip-path)"
                      >
                        <path
                          id="Path_4"
                          data-name="Path 4"
                          d="M27.712,0A27.712,27.712,0,1,0,55.423,27.712,27.71,27.71,0,0,0,27.712,0m13.26,29.937L24.442,41.308a2.7,2.7,0,0,1-4.233-2.225V16.34a2.7,2.7,0,0,1,4.233-2.225l16.53,11.371a2.7,2.7,0,0,1,0,4.45"
                          transform="translate(0.096 -0.03)"
                          fill="#009795"
                        />
                      </g>
                    </g>
                  </svg>
                </Link>
              </div>
              <div className="play-icon-text">
                <p>LEARN MORE ABOUT THE PLATFORM</p>
              </div>
            </div>

            <div
              className={`col-15 header-col menu-wrap nav-link ${isMenuOpen ? "show-menu" : ""}`}
            >
              <Menus />
            </div>

            <div className="header-col header-icons col-10">
              {/* Settings dropdown with hover + click */}
              <div
                className="setting-icon setting-icon-menu"
                onMouseEnter={() => setIsSettingsHovered(true)}
                onMouseLeave={() => setIsSettingsHovered(false)}
              >
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSettings();
                  }}
                >
                  <img
                    src="/assets/images/setting.svg"
                    alt="Settings"
                    className="logo"
                  />
                </Link>

                {/* Dropdown menu - conditionally rendered */}
                {showSettings && (
                  <ul className="setting-icon-menu-item">
                    {menusStatic.map((menu, index) => (
                      <li key={index}>
                        <Link
                          to={menu.url}
                          onClick={handleStaticMenuItemClick(menu.url)}
                        >
                          {menu.post_title}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link to="#" onClick={handleLogout}>
                        Log Out
                      </Link>
                    </li>
                  </ul>
                )}
              </div>

              {/* Search icon */}
              <div className="setting-icon">
                <Link to="/advanced-search">
                  <img
                    src="/assets/images/top-search-blue.svg"
                    alt="Search"
                    className="logo"
                  />
                </Link>
              </div>
            </div>

            <div className="hamburgerIcon-col">
              <button
                className="hamburgerIcon-btn"
                onClick={handleHamburgerClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25px"
                  height="25px"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  {/* ... SVG content ... */}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
