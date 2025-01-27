import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectCreate.css"; // CSSファイルをインポート
import { useIdListContext } from "./IdListContext";
import { useUserAuthContext } from "./UserAuthContext";
import { useChatPropatiesContext } from "./ChatPropatiesContext";


export default function MeetingPopup() {
    const navigate = useNavigate();
    const {UserID} = useUserAuthContext();
    const [MeetingName, setMeetingName] = useState("");
    const [MeetingDescription, setMeetingDescription] = useState("");
    const [MeetingTime, setMeetingTime] = useState("");
    const { GetALLMeetingId, CurrentProjectID, setCurrentProjectID, CurrentMeetingID, setCurrentMeetingID } = useIdListContext();
    const { set_meeting_name, set_meeting_description, set_maximum_time } = useChatPropatiesContext();

    const ClickedCreateProject = async() => {
        const { v4: uuidv4 } = require('uuid');
        const meeting_id = uuidv4();
        try {
            const response = await fetch("http://localhost:8080/FB/WriteMeetingId", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                        "user_id": UserID,
                        "project_id": CurrentProjectID,
                        "meeting_id": meeting_id,
                        "meeting_name": MeetingName,
                        "meeting_description": MeetingDescription
                }),
            });

            if (response.ok) {
                // alert("Success create meeting");
                setCurrentMeetingID(meeting_id);
                set_meeting_name(MeetingName);
                set_meeting_description(MeetingDescription);
                GetALLMeetingId({user_id: UserID, project_id: CurrentProjectID});
                set_maximum_time(MeetingTime);
                navigate("/DiscussPage");
            } else {
                alert("Fail create project");
                throw new Error(`Error: ${response.status}`);
            }
        } catch (error) {
            console.error("Failed to send transcript to API:", error);
        }
    };

    

    return (
        <div className="Create_container">
            <div className="Create_title">
                <input type="text" placeholder="会議のタイトルを入力してください" value={MeetingName} onChange={(e) => setMeetingName(e.target.value)}/>
            </div>
            <div className="Create_content">
                <div>
                    <div className="Create_details">
                        <textarea placeholder="会議目標と内容を入力してください" className="input-textarea" value={MeetingDescription} onChange={(e) => setMeetingDescription(e.target.value)}/>
                    </div>
                    <div className="Create_time">
                        <textarea placeholder="会議の時間" className="input-textarea" value={MeetingTime} onChange={(e) => setMeetingTime(e.target.value)}/>
                    </div>
                    <div>
                        <button className="create-button" onClick={ClickedCreateProject}>会議を開く</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
