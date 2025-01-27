import React, { useState } from "react";
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
    const [userEmail, setUserEmail] = useState("")
    const [password, setPassword] = useState("")

    const { loginUser, login_google, login_email, logout } = useUserAuthContext();


    const Clicksignup = async () => {
        try {
            // Firebase Authentication を使ってサインアップ
            const userCredential = await createUserWithEmailAndPassword(auth, userEmail, password);
            const userId = userCredential.user.uid;
            alert("Sign-up successful!"); // 成功時の通知
            await SendUserId(userId);
            GotoLoginPage();
        } catch (error) {
            console.error("Error during sign-up:", error);
            alert(error.message); // エラー時の通知
        }
    };

    const SendUserId = async(userId) => {
        try {
            const response = await fetch("http://localhost:8080/FB/WriteUserId", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                        "user_id": userId
                }),
            });

            if (response.ok) {
                console.log("Success send userid");
            } else {
                alert("Fail");
                throw new Error(`Error: ${response.status}`);
            }
        } catch (error) {
            console.error("Failed to send transcript to API:", error);
        }
    };

    const ClickGoogleImage = () => {
        // Firebase Authentication を使ってサインアップ
        login_google();
        GotoLoginPage();
    };

    return (
        <div className="Login_container">
            <h1 className="Login_title">Sign Up</h1>
            <div className="Login_form">
                <div className="UserEmail_input">
                    <input
                        type="text"
                        placeholder="Enter your email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                    />
                </div>
                <div className="Password_input">
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className="Login_button" onClick={Clicksignup}>
                    Sign Up
                </button>
                <div className="SVG_container">
                    <img src="/google_icon.svg" alt="Google Icon" width="50px" height="50px"  onClick={ClickGoogleImage} />
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
