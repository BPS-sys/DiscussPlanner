import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import { useUserAuthContext } from "./UserAuthContext";
// ブラウザを閉じてもログイン状態を保持, ブラウザのタブを閉じるとログアウト, アプリを再起動するとログアウト
import { browserLocalPersistence, browserSessionPersistence, inMemoryPersistence, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Firebase Authenticationをインポート

export default function LoginForm() {
    const navigate = useNavigate();
    const GotoProjectPage = () => {
        navigate("/ProjectPage");
    };
    const GotoSignUpPage = () => {
        navigate("/SignUpPage");
    };
    const { UserEmail, setUserEmail, PassWord, setPassWord, UserID, SetUserID } = useUserAuthContext();

    const Clicklogin = async () => {
        try {
            // Firebase Authentication を使ってサインアップ
            await setPersistence(auth, browserSessionPersistence);
            const UserInfo = await signInWithEmailAndPassword(auth, UserEmail, PassWord);
            SetUserID(UserInfo.user.uid)
            alert("Login successful!"); // 成功時の通知
            console.log(UserID);
            GotoProjectPage();
        } catch (error) {
            console.error("Error during sign-up:", error);
            alert(error.message); // エラー時の通知
        }
    };

    return (
        <div className="Login_container">
            <h1 className="Login_title">Login</h1>
            <div className="Login_form">
                <div className="UserID_input">
                    <input type="text" placeholder="Enter your user ID" value={UserEmail} onChange={(e) => setUserEmail(e.target.value)}/>
                </div>
                <div className="Password_input">
                    <input type="password" placeholder="Enter your password" value={PassWord} onChange={(e) => setPassWord(e.target.value)}/>
                </div>
                <button className="Login_button" onClick={Clicklogin}>
                    login
                </button>
                <button className="Signup_button" onClick={GotoSignUpPage}>
                    sign up
                </button>
                <div className="SVG_container">
                    <img src="/google_icon.svg" alt="Google Icon" width="50px" height="50px" />
                </div>
            </div>
        </div>
    );
}
