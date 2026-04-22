import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { loginUser } from "../redux/thunks/authThunks";
import { menusItems } from "../redux/thunks/menuThunk";
import { resetValues } from "../redux/slices/selectedValuesSlice";

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
              <a href="#"></a>
            </div>
          </div>
        </div>
        <div className="login-wrap">
          <div className="login-container">
            {error && (
              <p className="error" style={{ color: "red" }}>
                {error}
              </p>
            )}
            <h3>Username or Email </h3>
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

              <h3>Password </h3>
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
      </div>
    </div>
  );
}
