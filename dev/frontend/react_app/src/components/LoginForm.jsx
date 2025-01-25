import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

export default function Login() {
    const navigate = useNavigate();
    const GotoProjectPage = () => {
        navigate("/ProjectPage");
    };

    return (
        <div className="Login_container">
            <h1 className="Login_title">Login</h1>
            <div className="Login_form">
                <div className="UserID_input">
                    <input type="text" placeholder="Enter your user ID" />
                </div>
                <div className="Password_input">
                    <input type="password" placeholder="Enter your password" />
                </div>
                <button className="Login_button" onClick={GotoProjectPage}>
                    login
                </button>
                <button className="Signup_button" onClick={GotoProjectPage}>
                    sign up
                </button>
                <div className="SVG_container">
                    <img src="/google_icon.svg" alt="Google Icon" width="50px" height="50px" />
                </div>
            </div>
        </div>
    );
}
