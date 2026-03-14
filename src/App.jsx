import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "./components/Common/Header";
import Banner from "./components/Common/Banner";
import Footer from "./components/Common/Footer";
import TaxonomyPosts from "./components/Common/TaxonomyPosts";
import { fetchTaxonomyPosts } from "../src/redux/thunks/taxonomyThunks";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { menusItems } from "../src/redux/thunks/menuThunk";
import { staticMenu } from "../src/redux/thunks/staticManueThunk";
import ResetPassword from "./components/ResetPassword";
import SinglePostLayout from "./components/Common/SinglePostLayout";
import NotFound from "./components/Common/NotFound";
import Permission from "./components/Common/Permission";
import AdvancedSearch from "./components/AdvancedSearch";
import Account from "./components/Account";
import RssFeed from "./components/RssFeed";
import Contactus from "./components/ContactUS";
import ShowSheet from "./components/ShowSheet";
import Favorites from "./components/Favorites";
import AllShowSheet from "./components/AllShowSheet";
import SavedShowSheetPosts from "./components/Common/SavedShowSheetPosts";
import PrepHome from "./components/PrepHome";
import Tutorials from "./components/Tutorials";
import "./App.css";
import SinglePost from "./components/Common/SinglePost";
import { refreshUserData, emulateLogin } from "../src/redux/thunks/authThunks";
import Preview from "./components/Preview";
import SmartRoute from "./components/Common/SmartRoute";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === "/login";
  const isResetPasswordPage = location.pathname === "/forgot-password";

  const user = useSelector((state) => state.auth.user);
  const assignTaxonomies = useSelector((state) => state.auth.assignTaxonomies);

  const isLoggedIn = user !== null;

  // ---- Emulate Login ----
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        console.log("No user logged in, redirecting to login");
        navigate("/login", { replace: true });
        return;
      }
      localStorage.setItem("token", token);
      dispatch(emulateLogin(token))
        .unwrap()
        .then(() => {
          navigate("/", { replace: true });
        })
        .catch((error) => {
          console.error("Emulation failed:", error);
          navigate("/login", { replace: true });
        });
    }
  }, [location.search, dispatch, navigate]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const userData = storedUser ? JSON.parse(storedUser) : null;

    if (userData && userData.ID) {
      dispatch(menusItems(userData.ID));
      dispatch(staticMenu());
      dispatch(fetchTaxonomyPosts());
      dispatch(refreshUserData());
    }

    const params = new URLSearchParams(location.search);
    const hasToken = params.has("token");

    if (!hasToken) {
      if (isLoggedIn && isLoginPage) {
        navigate("/");
      } else if (!isLoggedIn && location.pathname !== "/login") {
        navigate("/login");
      }
    }
  }, [isLoggedIn, location.pathname, location.search, dispatch, navigate]);

  return (
    <>
      {!isLoginPage && !isResetPasswordPage && <Header />}
      {!isLoginPage && !isResetPasswordPage && <Banner />}
      <Routes>
        <Route path="/preview" element={<Preview />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PrepHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:slug"
          element={
            <ProtectedRoute>
              <SmartRoute />
            </ProtectedRoute>
          }
        />
        <Route path="/:postType/:slug" element={<SinglePost />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/permission" element={<Permission />} />
        <Route path="/advanced-search" element={<AdvancedSearch />} />
        <Route path="/account" element={<Account />} />
        <Route path="/rss-feeds" element={<RssFeed />} />
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="/contact" element={<Contactus />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/show-sheet" element={<ShowSheet />} />
        <Route path="/prep-showsheet" element={<AllShowSheet />} />
        <Route path="/prep-showsheet/:slug" element={<SavedShowSheetPosts />} />
      </Routes>
      {!isLoginPage && !isResetPasswordPage && <Footer />}
    </>
  );
}

export default App;