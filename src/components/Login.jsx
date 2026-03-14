import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { loginUser } from "../redux/thunks/authThunks";
import { menusItems } from "../redux/thunks/menuThunk";
import Features from "../components/Features";
import Footer from "./Common/Footer";
import { resetValues } from '../redux/slices/selectedValuesSlice';


export default function LoginForm() {
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(credentials));
    if (result.meta.requestStatus === "fulfilled") {
      const user = localStorage.getItem("user");
      localStorage.removeItem("selectedTaxonomy");
      const userData = user ? JSON.parse(user) : null;
      const userID = userData.ID;
      dispatch(resetValues());
      await dispatch(menusItems(userID));
      navigate("/");
    }
  };

  useEffect(() => {
    document.body.classList.toggle(
      "login-page",
      !!document.querySelector(".login-form"),
    );

    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  return (
    <div className="login-fm">
      <div className="login-form">
        <div className="container form-logo">
          <div className="row">
            <div className="col-12">
              <a href="#">
                <img
                  src="/assets/images/login-logo.svg"
                  alt="Site Logo"
                  className="logo"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="login-wrap">
          <div id="logintitle" className="login_title">
            <h2>
              All Your <span>FAVORITE BRANDS.</span> <br /> All in{" "}
              <span>ONE PLACE.</span>
            </h2>
          </div>
          <div className="login-container">
            {error && (
              <p className="error" style={{ color: "red" }}>
                {error}
              </p>
            )}
            <h3>Username or Email</h3>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Username or Email"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <h3>Password</h3>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                  ></i>
                </span>
              </div>
              <div className="checkbox-container">
                <label>
                  {/* <input
                    type="checkbox"
                    name="rememberMe"
                    onChange={handleChange}
                  />{" "} */}
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleChange}
                  />
                  Remember Me
                </label>
                <Link to="/forgot-password" className="forgot_link">
                  Forgot Password
                </Link>
              </div>

              <div className="log-btn">
                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div id="brandssec" className="login_brands_images">
          <div className="brand_image">
            <img
              src="/assets/images/nineball-radio-2.png"
              className="login_img"
              alt="Nineball Radio"
              loading="lazy"
            />
          </div>

          <div className="brand_image">
            <img
              src="/assets/images/USRN.png"
              className="login_img"
              alt="USRN"
              loading="lazy"
            />
          </div>

          <div className="brand_image">
            <img
              src="/assets/images/Universal-Comedy-Network-Logo-NEW.png"
              className="login_img"
              alt="Universal Comedy Network"
              loading="lazy"
            />
          </div>

          <div className="brand_image">
            <img
              src="/assets/images/InstaGuest-Reversed.png"
              className="login_img"
              alt="InstaGuest"
              loading="lazy"
            />
          </div>

          <div className="brand_image">
            <img
              src="/assets/images/Pulse-Reversed.png"
              className="login_img"
              alt="Pulse of Radio"
              loading="lazy"
            />
          </div>

          <div className="brand_image">
            <img
              src="/assets/images/Spark-Reversed.png"
              className="login_img"
              alt="Spark"
              loading="lazy"
            />
          </div>
        </div>
        <div className="btn-wrap">
          <a
            href="https://www.unitedstations.com/services/boomsite-fm/"
            className="learn-button"
            target="_blank"
          >
            LEARN MORE
          </a>
        </div>
      </div>
      {/* Features Section */}
      <Features />
      <Footer />
    </div>
  );
}
