import { useContext, useState, createContext } from "react";

const FastAPIContext = createContext();

export const FastAPIProvider = ({ children }) => {
    const [UserMessage, SetUserMessage] = useState("");
    const [AIMessage, SetAIMessage] = useState("");
    const [documents, setDocuments] = useState([]);
    const addDocuments = (newdoc) => {
        setDocuments(prevdoc => [...prevdoc, newdoc]);
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

