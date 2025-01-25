"user client"
import { useState, useEffect, createContext, useContext } from "react";
import { auth } from "../firebase"; // Firebase Authenticationをインポート
import { 
    browserLocalPersistence, 
    browserSessionPersistence, 
    inMemoryPersistence, 
    setPersistence, 
    signInWithEmailAndPassword,  
    signInWithPopup, 
    signOut,
    signInWithRedirect, 
    getRedirectResult, 
    GoogleAuthProvider } from "firebase/auth";

const UserAuthContext = createContext();

const provider = new GoogleAuthProvider();

export const UserAuthProvider = ({ children }) => {
    
    const [loginUser, setLoginUser] = useState(null);

    // 認証情報の監視および更新
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setLoginUser(user);
        });
        return () => unsubscribe();
    }, []);

    // google認証 
    const login_google = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            setLoginUser(result.user);
            const user = result.user
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    // email認証
    const login_email = async (UserEmail, PassWord) => {
        console.log(UserEmail)
        try {
            await setPersistence(auth, inMemoryPersistence);
            await signInWithEmailAndPassword(auth, UserEmail, PassWord);
            setLoginUser(auth.currentUser);
            alert("Login successful!");
        } catch (error) {
            console.error("Error during sign-up:", error);
            alert(error.message); // エラー時の通知
        }
    };

    // ログアウト
    const logout = async () => {
        try {
            await signOut(auth);
            setLoginUser(null);
            alert("Logout successful!");
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const value = {
        loginUser,
        login_google,
        login_email,
        logout,
    };

    return (
        <UserAuthContext.Provider value={value}>
             {children}
        </UserAuthContext.Provider>
    );
};

export const useUserAuthContext = () => {
    const context = useContext(UserAuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthContextProvider');
    }
    return context;
};