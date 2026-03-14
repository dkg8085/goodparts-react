import React, { useEffect, useState } from "react";
import { menusItems } from "../../redux/thunks/menuThunk";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { resetValues, toggleValue } from "../../redux/slices/selectedValuesSlice";

export default function Menus() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isHovered, setIsHovered] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [openL2SubMenu, setOpenL2SubMenu] = useState(null);
  const [openL3SubMenu, setOpenL3SubMenu] = useState(null);

  const isDropdownOpen = isHovered || isToggled;

  const { menus, loading, error } = useSelector((state) => state.menus);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const userData = user ? JSON.parse(user) : null;
    if (userData && userData.ID) {
      dispatch(menusItems(userData.ID));
    }
  }, [dispatch]);

  const handleMenuClick = (e, menuItem) => {
    e.preventDefault();

  
    if (menuItem.title === "RSS Feeds") {
      localStorage.removeItem("selectedTaxonomies");
      localStorage.removeItem("selectedTaxonomy");
      navigate("/rss-feeds");
      closeDropdown();
      return;
    }

    if (menuItem.title === "Prep Home") {
      localStorage.removeItem("selectedTaxonomies");
      localStorage.removeItem("selectedTaxonomy");
      navigate("/");
      closeDropdown();
      return;
    }
    

    let parentMenu = null;
    if (menuItem.menu_item_parent !== "0") {
      parentMenu = menus.find((m) => m.ID.toString() === menuItem.menu_item_parent);
    }

    let grandParentMenu = null;
    if (parentMenu && parentMenu.menu_item_parent !== "0") {
      grandParentMenu = menus.find((m) => m.ID.toString() === parentMenu.menu_item_parent);
    }

    const navigationTarget =
      grandParentMenu && grandParentMenu.url
        ? grandParentMenu.url
        : parentMenu && parentMenu.url
        ? parentMenu.url
        : menuItem.url;

    if (navigationTarget && navigationTarget !== "#") {
      const slug = navigationTarget.replace(/^\/|\/$/g, "");
      localStorage.setItem("selectedTaxonomy", slug);
    }

    dispatch(resetValues());

    if (menuItem.menu_item_parent !== "0") {
      dispatch(toggleValue(Number(menuItem.object_id)));
    }

    let targetPath = navigationTarget;
    if (targetPath && targetPath.startsWith("http")) {
      try {
        const urlObj = new URL(targetPath);
        targetPath = urlObj.pathname + urlObj.search + urlObj.hash;
      } catch (err) {
        console.error("Invalid URL", targetPath);
      }
    }

    closeDropdown();

    if (targetPath && targetPath !== "#") {
      navigate(targetPath);
    } else {
      navigate("/permission");
      window.location.reload();
    }
  };

  const closeDropdown = () => {
    setIsHovered(false);
    setIsToggled(false);
    setOpenL2SubMenu(null);
    setOpenL3SubMenu(null);
  };

  const hasChildren = (itemId) =>
    menus && menus.some((m) => m.menu_item_parent === itemId.toString());

  const isActive = (menuItem) => {
    if (!menuItem.url) return false;
    let path = menuItem.url;
    if (path.startsWith("http")) {
      try { path = new URL(path).pathname; } catch (_) {}
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <ul className="menu menu-wrap-col">
      <li
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setOpenL2SubMenu(null);
          setOpenL3SubMenu(null);
        }}
      >
        <a
          href="#"
          className="menu-text"
          onClick={(e) => {
            e.preventDefault();
            setIsToggled(!isToggled);
          }}
        >
          PREP CONTENT
        </a>

        {isDropdownOpen && !loading && menus && menus.length > 0 && (
          <ul className="dropdown">
            {menus
              .filter((item) => item.menu_item_parent === "0")
              .map((menuItem) => {          
                const itemHasChildren = hasChildren(menuItem.ID);
                // const active = isActive(menuItem);
                const active =
                isActive(menuItem) ||
                (menuItem.title === "Prep Home" && location.pathname === "/");
                const isOpen = openL2SubMenu === menuItem.ID.toString();
                return (
                  <li
                    key={menuItem.ID}
                    className={`menu-item ${active ? "active" : ""} ${
                      itemHasChildren ? "has-children" : ""
                    } ${isOpen ? "open" : ""}`}
                    onMouseEnter={() => {
                      setOpenL2SubMenu(itemHasChildren ? menuItem.ID.toString() : null);
                      setOpenL3SubMenu(null);
                    }}
                  >
                    <a href="#" onClick={(e) => handleMenuClick(e, menuItem)}>
                      <span>{menuItem.title}</span>
                      {itemHasChildren && (
                        <span className="parent-indicator">
                          <FontAwesomeIcon icon={faCaretRight} />
                          <FontAwesomeIcon icon={faXmark} />
                        </span>
                      )}
                    </a>

                    {itemHasChildren && isOpen && (
                      <ul className="sub-dropdown">
                        {menus
                          .filter((child) => child.menu_item_parent === menuItem.ID.toString())
                          .map((childItem) => {
                            const childHasChildren = hasChildren(childItem.ID);
                            const childActive = isActive(childItem);
                            const childOpen = openL3SubMenu === childItem.ID.toString();
                            return (
                              <li
                                key={childItem.ID}
                                className={`menu-item ${childActive ? "active" : ""} ${
                                  childHasChildren ? "has-children" : ""
                                } ${childOpen ? "open" : ""}`}
                                onMouseEnter={() =>
                                  setOpenL3SubMenu(
                                    childHasChildren ? childItem.ID.toString() : null
                                  )
                                }
                              >
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    if (!childHasChildren) {
                                      handleMenuClick(e, childItem);
                                    } else {
                                      e.preventDefault();
                                      setOpenL3SubMenu(
                                        childOpen ? null : childItem.ID.toString()
                                      );
                                    }
                                  }}
                                >
                                  <span>{childItem.title}</span>
                                  {childHasChildren && (
                                    <span className="parent-indicator">
                                      <FontAwesomeIcon icon={faCaretRight} />
                                      <FontAwesomeIcon icon={faXmark} />
                                    </span>
                                  )}
                                </a>

                                {childHasChildren && childOpen && (
                                  <ul className="sub-dropdown">
                                    {menus
                                      .filter(
                                        (gc) => gc.menu_item_parent === childItem.ID.toString()
                                      )
                                      .map((grandChild) => (
                                        <li
                                          key={grandChild.ID}
                                          className={`menu-item ${
                                            isActive(grandChild) ? "active" : ""
                                          }`}
                                        >
                                          <a
                                            href="#"
                                            onClick={(e) => handleMenuClick(e, grandChild)}
                                          >
                                            <span>{grandChild.title}</span>
                                          </a>
                                        </li>
                                      ))}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                      </ul>
                    )}
                  </li>
                );
              })}

            {/* Static extra links */}
            <li className="menu-item">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  closeDropdown();
                  navigate("/show-sheet");
                }}
              >
                <span>Show Sheet</span>
              </a>
            </li>
            <li className="menu-item">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  closeDropdown();
                  navigate("/prep-showsheet");
                }}
              >
                <span>Saved Show Sheets</span>
              </a>
            </li>
          </ul>
        )}
      </li>
    </ul>
  );
}