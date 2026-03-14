import React from "react";
import { useNavigate } from "react-router-dom"; export default function NotFound() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("user");

  const handleRedirect = () => {
    if (isLoggedIn) {
      navigate(-1);
    } else {
      navigate("/login");
    }
  };
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <button onClick={handleRedirect}>Go to Home</button>
    </div>
  );
}