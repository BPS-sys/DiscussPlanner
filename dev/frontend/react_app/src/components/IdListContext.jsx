import { useContext, useState, createContext, useEffect } from "react";

const IdListContext = createContext();

export const IdListProvider = ({ children }) => {
    const [ALLProjectIdList, setALLProjectIdList] = useState([]);
    const [ALLMeetingIdList, setALLMeetingIdList] = useState([]);
    const [CurrentProjectID, setCurrentProjectID] = useState("");
    const [CurrentMeetingID, setCurrentMeetingID] = useState("");

    // setするだけ
    const SetALLProjectIdList = (new_project) => {
        setALLProjectIdList(new_project);
    };

    // setするだけ
    const SetALLMeetingIdList = (new_meeting) => {
        setALLMeetingIdList(new_meeting);
    };

    const currentHost = window.location.hostname;  // ホスト名（ドメイン名）

    // ユーザーIDを基に全プロジェクトIDを取得する
    const GetALLProjectId = async({user_id}) => {
        
        try {
            const response = await fetch(`https://${currentHost}/api/FB/GetALLProjectId`, {
            // const response = await fetch("http://localhost:8080/FB/GetALLProjectId", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "user_id": user_id
                })
            });

            if (response.ok) {
                const data = await response.json();
                SetALLProjectIdList([data.ALLProjectId]);
            } else {
                throw new Error(`Error: ${response.status}`);
            }
        } catch (error) {
            console.error("Failed to send transcript to API:", error);
        }
    };

    // 2つのIDを基に全ミーティングIDを取得する
    const GetALLMeetingId = async({user_id, project_id}) => {
        try {
            const response = await fetch(`https://${currentHost}/api/FB/GetALLMeetingId`, {
            // const response = await fetch("http://localhost:8080/FB/GetALLMeetingId", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "user_id": user_id,
                    "project_id": project_id
                })
            });

            if (response.ok) {
                const data = await response.json();
                SetALLMeetingIdList(data.ALLMeetingId);
            } else {
                throw new Error(`Error: ${response.status}`);
            }
        } catch (error) {
            console.error("Failed to send transcript to API:", error);
        }
    };


    return (
        <IdListContext.Provider value={{ ALLProjectIdList, ALLMeetingIdList, GetALLMeetingId, GetALLProjectId, CurrentProjectID, setCurrentProjectID, CurrentMeetingID, setCurrentMeetingID }}>
            {children}
        </IdListContext.Provider>
    );
};

// Context を利用するカスタムフック
export const useIdListContext = () => {
    return useContext(IdListContext);
};
