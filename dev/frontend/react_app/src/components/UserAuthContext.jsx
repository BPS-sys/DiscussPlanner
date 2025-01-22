import { useContext, useState, createContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // Firebase Authenticationをインポート

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
    const [UserEmail, setUserEmail] = useState('');
    const [PassWord, setPassWord] = useState('');
    const [UserID, setUserID] = useState('');
    const SetUserID = async(id) => {
        await setUserID(id);
    };
    
    const [CurrentUser, setCurrentUser] = useState(null);
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user); // ユーザー情報をセット
        });

        return () => unsubscribe(); // クリーンアップ
    }, []);

    return (
        <UserAuthContext.Provider value={{ UserEmail, setUserEmail, PassWord, setPassWord, UserID, SetUserID, CurrentUser }}>
            {children}
        </UserAuthContext.Provider >
    );
};

// Context を利用するカスタムフック
export const useUserAuthContext = () => {
    return useContext(UserAuthContext);
};

