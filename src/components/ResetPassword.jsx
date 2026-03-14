import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { resetPassword } from "../redux/thunks/ResetPasswordThunk";

export default function ResetPassword() {
  const [credentials, setCredentials] = useState({ email: "" });
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(resetPassword(credentials));

    if (result.meta.requestStatus === "fulfilled") {
      setMessage(result.payload.message);
    } else if (result.meta.requestStatus === "rejected") {
      setMessage(result.payload);
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
    <div className="login-form">
      <div className="container form-logo">
        <div className="row">
          <div className="col-12">
            <a href="/">
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
          <h3>Reset Your Password</h3>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email Address"
                value={credentials.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="checkbox-container">
              <label>{message}</label>
              <Link to="/login" className="forgot_link">
                Login
              </Link>
            </div>
            <div className="log-btn">
              <button type="submit" className="login-button reset-pass">
                Send Mail
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="container tax-logo-container">
       
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
    </div>
  );
}
