import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MeetingDetails.css";
import { useUserAuthContext } from "./UserAuthContext";
import { useIdListContext } from "./IdListContext";



export default function MeetingDetails() {
    const [ProjectName, setProjectName] = useState("");
    const [ProjectDescription, setProjectDescription] = useState("");

    const { loginUser } = useUserAuthContext();
    const { CurrentProjectID } = useIdListContext();

    // プロジェクト情報を取得する関数
    const GetProjectInfoFromId = async () => {
        try {
            const response = await fetch("http://localhost:8080/FB/GetProjectInfoFromId", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "user_id": loginUser.uid,
                    "project_id": CurrentProjectID,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setProjectName(data.project_name);
                setProjectDescription(data.project_description);
            } else {
                throw new Error(`Error: ${response.status}`);
            }
        } catch (error) {
            console.error("Failed to send transcript to API:", error);
        }
    };

    useEffect(()=>{
        GetProjectInfoFromId();
    }, []);

    return (
        <div className="MeetingDetails_container">
            <h1 className="Meeting_title">{ProjectName}</h1>
            <p className="Meeting_details">{ProjectDescription}</p>
        </div>
    );
}
