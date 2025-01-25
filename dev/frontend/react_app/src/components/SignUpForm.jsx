import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import { useUserAuthContext } from "./UserAuthContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Firebaseの初期化設定をインポート

export default function SignUpForm() {
    const navigate = useNavigate();
    const GotoLoginPage = () => {
        navigate("/LoginPage");
    };

    const { UserEmail, setUserEmail, PassWord, setPassWord } = useUserAuthContext();

    const Clicksignup = async () => {
        try {
            // Firebase Authentication を使ってサインアップ
            await createUserWithEmailAndPassword(auth, UserEmail, PassWord);
            alert("Sign-up successful!"); // 成功時の通知
            GotoLoginPage();
        } catch (error) {
            console.error("Error during sign-up:", error);
            alert(error.message); // エラー時の通知
        }
    };

    return (
        <div className="Login_container">
            <h1 className="Login_title">Sign Up</h1>
            <div className="Login_form">
                <div className="UserEmail_input">
                    <input
                        type="text"
                        placeholder="Enter your email"
                        value={UserEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                    />
                </div>
                <div className="Password_input">
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={PassWord}
                        onChange={(e) => setPassWord(e.target.value)}
                    />
                </div>
                <button className="Login_button" onClick={Clicksignup}>
                    Sign Up
                </button>
                <div className="SVG_container">
                    <img src="/google_icon.svg" alt="Google Icon" width="50px" height="50px" />
                </div>
                <br></br>
                <br></br>
                <p>
                    Already have an account?{" "}
                    <span onClick={GotoLoginPage} style={{ color: "blue", cursor: "pointer" }}>
                        Login here
                    </span>
                </p>
            </div>
        </div>
    );
}
