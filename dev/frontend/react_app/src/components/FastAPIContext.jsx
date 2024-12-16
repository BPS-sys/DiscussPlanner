import { useContext, useState, createContext } from "react";

const FastAPIContext = createContext();

export const FastAPIProvider = ({ children }) => {
    const [UserMessage, setUserMessage] = useState("");
    const [AIMessage, setAIMessage] = useState("");
    const [documents, setDocuments] = useState([]);
    const addDocuments = (newdoc) => {
        setDocuments(prevdoc => [...prevdoc, newdoc]);
        console.log("AI",AIMessage);
        console.log("user",UserMessage);
      };
    const SetUserMessage = async (doc) => {
        await setUserMessage(doc);
    };
    const SetAIMessage = async (doc) => {
        await setAIMessage(doc);
    };
    return (
        <FastAPIContext.Provider value={{ UserMessage, SetUserMessage, AIMessage, SetAIMessage, documents, setDocuments, addDocuments }}>
            {children}
        </FastAPIContext.Provider >
    );
};

// Context を利用するカスタムフック
export const useFastAPIContext = () => {
    return useContext(FastAPIContext);
};

