import { React, useEffect } from "react";
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
    const { UserEmail, setUserEmail, PassWord, setPassWord, UserID, SetUserID } = useUserAuthContext();

    const Clicklogin = async () => {
        try {
            // Firebase Authentication を使ってサインアップ
            await setPersistence(auth, inMemoryPersistence);
            await signInWithEmailAndPassword(auth, UserEmail, PassWord);
            SetUserID(auth.currentUser.uid);
            alert("Login successful!"); // 成功時の通知
            SendUserId();
            GotoProjectPage();
        } catch (error) {
            console.error("Error during sign-up:", error);
            alert(error.message); // エラー時の通知
        }
    };

    const ClickGoogleImage = () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
    
        // リダイレクトを開始
        signInWithRedirect(auth, provider);
    
        // リダイレクト後の結果を取得
        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    // Google認証の結果を取得
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    // const token = credential.accessToken; // 必要なら使用
                    const user = result.user; // 認証されたユーザー情報
                    SetUserID(user.uid); // ユーザーIDをセット
                    console.log(user.uid);
                    alert("Login successful!"); // 成功時の通知
                }
            })
            .catch((error) => {
                // エラーハンドリング
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData?.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.error("Error during login:", errorCode, errorMessage);
            });
    };

    const SendUserId = async() => {
        try {
            const response = await fetch("http://localhost:8080/FB/WriteUserId", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                        "user_id": auth.currentUser.uid
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

    // UserID が更新されたときに実行
    useEffect(() => {
        if (UserID) {
            console.log("Updated UserID:", UserID);
        }
        else {
            console.log("empty useid!");
        };
        
    }, [UserID]);



    return (
        <div className="Login_container">
            <h1 className="Login_title">Login</h1>
            <div className="Login_form">
                <div className="UserEmail_input">
                    <input type="text" placeholder="Enter your user Email" value={UserEmail} onChange={(e) => setUserEmail(e.target.value)} />
                </div>
                <div className="Password_input">
                    <input type="password" placeholder="Enter your password" value={PassWord} onChange={(e) => setPassWord(e.target.value)} />
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
