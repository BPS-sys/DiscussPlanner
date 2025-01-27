import { useContext, useState, createContext, useEffect } from "react";

const ChatPropatiesContext = createContext();

export const ChatPropatiesProvider = ({ children }) => {
    
    const [project_name, set_project_name] = useState("");
    const [project_description, set_project_description] = useState("");
    const [meeting_name, set_meeting_name] = useState("");
    const [meeting_description, set_meeting_description] = useState("");
    const [ai_role, set_ai_role] = useState("");
    const [maximum_time, set_maximum_time] = useState("");
    const [OnBoardIdea, setIdeaOnBoard] = useState([]);
    const [GotIdea, setGotIdea] = useState([]);

    const SetIdeaOnBoard_ADD = (doc) => {
        setIdeaOnBoard(prevdoc => [...prevdoc, doc]);
    };
    
    const SetGotIdea = (doc) => {
        setGotIdea([doc]);
    };

    return (
        <ChatPropatiesContext.Provider value={{ project_name, set_project_name, project_description, set_project_description, meeting_name, set_meeting_name, meeting_description, set_meeting_description, ai_role, set_ai_role, maximum_time, set_maximum_time, OnBoardIdea, setIdeaOnBoard, GotIdea, SetIdeaOnBoard_ADD, SetGotIdea }}>
            {children}
        </ChatPropatiesContext.Provider >
    );
};

// Context を利用するカスタムフック
export const useChatPropatiesContext = () => {
    return useContext(ChatPropatiesContext);
};

