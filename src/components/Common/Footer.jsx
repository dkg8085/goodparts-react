import { Link, useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const preLoginRoutes = ["/login"]; 
  const isPreLoginPage = preLoginRoutes.includes(location.pathname);

  
  let assignTaxonomyData = [];
  try {
    assignTaxonomyData =
      JSON.parse(localStorage.getItem("assign_taxonomies")) || [];
    if (!Array.isArray(assignTaxonomyData)) throw new Error();
  } catch {
    assignTaxonomyData = [];
  }

  const assignTaxonomyName = assignTaxonomyData[0] || null;

  const handleLogoClick = (e) => {
    e.preventDefault();
    localStorage.setItem("selectedTaxonomy", assignTaxonomyName);
    localStorage.removeItem("selectedTaxonomies");
    // navigate(`/${assignTaxonomyName}`);
    navigate(`/`);
    // window.location.reload();
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-nav">
          {/* Logo Section */}
          <div className="footer-logo-wrapper">
            <div className="footer-logo">
              <Link onClick={handleLogoClick}>
                <img
                  src="/assets/images/footer-logo.svg"
                  alt="Site Logo"
                  className="logo"
                />
              </Link>
            </div>
          </div>
          {/*Pre-login page */}

          {isPreLoginPage && (
            <div className="footer-links-wrapper">
              <ul className="footer-link-list">
                <li className="links-list">
                  <Link className="nav-link" to="/about-us">
                    ABOUT
                  </Link>
                </li>
                <li className="links-list">
                  <Link className="nav-link" to="/products">
                    PRODUCTS
                  </Link>
                </li>
                <li className="links-list">
                  <Link className="nav-link" to="/press">
                    PRESS
                  </Link>
                </li>
                <li className="links-list">
                  <Link className="nav-link" to="/contact">
                    CONTACT
                  </Link>
                </li>
                <li className="links-list">
                  <Link className="nav-link" to="/prep-content">
                    PREP CONTENT
                  </Link>
                </li>
                <li className="links-list">
                  <Link className="nav-icon" to="/settings">
                    <img
                      src="https://boom-site-wp.s3.us-east-2.amazonaws.com/wp-content/uploads/2024/02/21185159/settings.svg"
                      alt="s  ettings"
                    />
                  </Link>
                </li>
              </ul>
            </div>
          )}
          
          {!isPreLoginPage && (
            <div className="col-6 contact-text">
              <Link className="g-menu-item-container" to="/contact">
                <span className="g-menu-item-content">
                  <span className="g-menu-item-title">Contact</span>
                </span>
              </Link>
            </div>
          )}

          {/* Copyright Section */}
          <div className="row">
            <div className="col-12 copyright-section">
              <p>©{new Date().getFullYear()} United Stations Media Networks.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
