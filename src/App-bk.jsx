import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from './components/Common/Header';
import Banner from './components/Common/Banner';
import Footer from './components/Common/Footer';
import TaxonomyPosts from './components/Common/TaxonomyPosts';
import { fetchTaxonomyPosts } from "../src/redux/thunks/taxonomyThunks";
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { menusItems } from '../src/redux/thunks/menuThunk';
import { staticMenu } from '../src/redux/thunks/staticManueThunk';
import ResetPassword from './components/ResetPassword';
import SinglePostLayout from './components/Common/SinglePostLayout';
import NotFound from './components/Common/NotFound';
import Permission from './components/Common/Permission';
import AdvancedSearch from './components/AdvancedSearch';
import Account from './components/Account';
import RssFeed from './components/RssFeed';
import Contactus from './components/ContactUS';
import ShowSheet from './components/ShowSheet';
import Favorites from './components/Favorites';
import AllShowSheet from './components/AllShowSheet';
import SavedShowSheetPosts from './components/Common/SavedShowSheetPosts';
import PrepHome from './components/PrepHome';
import Tutorials from './components/Tutorials';
import './App.css';
import SinglePost from './components/Common/SinglePost';
import { refreshUserData } from '../src/redux/thunks/authThunks';
import Preview from './components/Preview';

function App() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const isLoginPage = location.pathname === '/login';
    const isResetPasswordPage = location.pathname === '/forgot-password';

    const user = useSelector((state) => state.auth.user);
    const taxonomySettings = useSelector((state) => state.auth.taxonomySettings);

    const assignTaxonomies = useSelector((state) => state.auth.assignTaxonomies);

    const isLoggedIn = user !== null;

    const selectedTaxonomy = localStorage.getItem("selectedTaxonomy") || '';
    let assignTaxonomyName = '';

    if (selectedTaxonomy !== '') {
        assignTaxonomyName = selectedTaxonomy;
    } else if (assignTaxonomies.length > 0) {
        localStorage.setItem("selectedTaxonomy", assignTaxonomies[0]);
        assignTaxonomyName = assignTaxonomies[0];
    }

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const userData = storedUser ? JSON.parse(storedUser) : null;

        if (userData && userData.ID) {
            dispatch(menusItems(userData.ID));
            dispatch(staticMenu());
            dispatch(fetchTaxonomyPosts());
            dispatch(refreshUserData()); // 👈 syncs fresh data on every load/refresh
        }

        if (isLoggedIn && isLoginPage) {
            navigate('/');
        } else if (!isLoggedIn && location.pathname !== '/login') {
            navigate('/login');
        }
    }, [isLoggedIn, dispatch]);

    // ✅ Poll every 5 minutes for live backend changes
    useEffect(() => {
        if (!isLoggedIn) return;

        const interval = setInterval(() => {
            dispatch(refreshUserData());
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [isLoggedIn, dispatch]);

    useEffect(() => {
        // taxonomy settings CSS vars — uncomment when needed
        // if (Array.isArray(taxonomySettings) && taxonomySettings.length > 0) {
        //     const settings = taxonomySettings[0];
        //     document.documentElement.style.setProperty('--main-color', settings.main_color);
        //     document.documentElement.style.setProperty('--secondary-color', settings.secondary_color);
        //     document.documentElement.style.setProperty('--logo-image', `url(${settings.logo_image_url})`);
        //     document.documentElement.style.setProperty('--banner-image', `url(${settings.banner_image_url})`);
        // }
    }, [taxonomySettings]);

    return (
        <>
            {!isLoginPage && !isResetPasswordPage && <Header />}
            {!isLoginPage && !isResetPasswordPage && <Banner />}
            <Routes>
                <Route path="/preview" element={<Preview />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ResetPassword />} />
                <Route path="/" element={<ProtectedRoute><PrepHome /></ProtectedRoute>} />
                <Route path={`/${assignTaxonomyName}`} element={<ProtectedRoute><TaxonomyPosts /></ProtectedRoute>} />
                <Route path={`/:slug`} element={<ProtectedRoute><SinglePostLayout /></ProtectedRoute>} />
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