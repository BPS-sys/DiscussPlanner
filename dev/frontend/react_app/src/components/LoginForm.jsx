import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import { useUserAuthContext } from "./UserAuthContext";
// ブラウザを閉じてもログイン状態を保持, ブラウザのタブを閉じるとログアウト, アプリを再起動するとログアウト
import { browserLocalPersistence, browserSessionPersistence, inMemoryPersistence, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Firebase Authenticationをインポート
import { convertLength } from "@mui/material/styles/cssUtils";
import { getAuth, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "firebase/auth";

export default function LoginForm() {
    const navigate = useNavigate();
    const GotoProjectPage = () => {
        navigate("/ProjectPage");
    };
    const GotoSignUpPage = () => {
        navigate("/SignUpPage");
    };
    const [password, setPassWord] = useState("");
    const [email, setEmail] = useState("");
    
    const { loginUser, login_google, login_email, logout } = useUserAuthContext();
    
    const Clicklogin = async () => {
        try {
            // Firebase Authentication を使ってサインアップ
            login_email(email, password);
            SendUserId();
        } catch (error) {
            console.error("Error during sign-up:", error);
            alert(error.message); // エラー時の通知
        }
    };


    const ClickGoogleImage = () => {
        // Firebase Authentication を使ってサインアップ
        login_google();
    };

    const SendUserId = async() => {
        try {
            const response = await fetch("http://localhost:8080/FB/WriteUserId", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                        "user_id": loginUser.uid
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

    //　ログイン情報が更新
    useEffect(() => {
        // ログインユーザーがいる場合ページ遷移
        if (loginUser) {
            GotoProjectPage();
        }
    }, [loginUser]);



    return (
        <div className="Login_container">
            <h1 className="Login_title">Login</h1>
            <div className="Login_form">
                <div className="UserEmail_input">
                    <input type="text" placeholder="Enter your user Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="Password_input">
                    <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassWord(e.target.value)} />
                </div>
                <button className="Login_button" onClick={Clicklogin}>
                    login
                </button>
                <button className="Signup_button" onClick={GotoSignUpPage}>
                    sign up
                </button>
                <div className="SVG_container">
                    <img src="/google_icon.svg" alt="Google Icon" width="50px" height="50px" onClick={ClickGoogleImage} />
                </div>
            </div>
        </div>
    );
}
