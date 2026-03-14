import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
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
       
        if (result.meta.requestStatus === 'fulfilled') {
            setMessage(result.payload.message);
        } else if (result.meta.requestStatus === 'rejected') {
            setMessage(result.payload);
        }
    };

    useEffect(() => {
        document.body.classList.toggle("login-page", !!document.querySelector(".login-form"));
        return () => {
            document.body.classList.remove("login-page");
        };
    }, []);

    return (
        <div className="login-form">
            <div className="container form-logo">
                <div className="row">
                    <div className="col-12">
                        <a href="#">
                            <img
                                src="/assets/images/login-logo.svg"
                                alt="Site Logo"
                                className="logo" />
                        </a>
                    </div>
                </div>
            </div>
            <div className="login-wrap">
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
                            <label>
                                  {message}
                            </label>
                            <Link to="/login" className="forgot_link">Login</Link>
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
                <div className="row">
                    <div className="col-12">
                        {/* <div className="img-wrap"> */}
                        <img
                            src="/assets/images/mrprep-logo-2.png"
                            alt="Site Logo"
                            className="logo" />
                        {/* </div> */}
                        {/* <div className="img-wrap"> */}
                        <img
                            src="/assets/images/thehookup-logo.png"
                            alt="Site Logo"
                            className="logo" />
                        {/* </div> */}
                        {/* <div className="img-wrap"> */}
                        <img
                            src="./assets/images/prepcountry-logo-2.png"
                            alt="Site Logo"
                            className="logo" />
                        {/* </div> */}
                    </div>
                    <div className="col-12">
                        {/* <div className="img-wrap"> */}
                        <img
                            src="/assets/images/juicyprep-logo-2.png"
                            alt="Site Logo"
                            className="logo" />
                        {/* </div> */}
                        {/* <div className="img-wrap"> */}
                        <img
                            src="/assets/images/mrlaughs-logo.png"
                            alt="Site Logo"
                            className="logo" />
                        {/* </div> */}
                    </div>
                </div>
            </div>
        </div >
    );
}
