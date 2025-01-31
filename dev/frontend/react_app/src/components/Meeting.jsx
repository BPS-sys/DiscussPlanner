import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MeetingList.css";
import { useIdListContext } from "./IdListContext";
import { useUserAuthContext } from "./UserAuthContext";

export default function Meeting({meeting_id}) {

    const Times = {
        day: '2024//03/09',
        time: '11:30~12:00'
    };

    const [isPlaying, setIsPlaying] = useState(false);
    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };
    const [MeetingName, setMeetingName] = useState("");
    const [MeetingDescription, setMeetingDescription] = useState("");
    const { CurrentProjectID } = useIdListContext();
    const {loginUser} = useUserAuthContext();
    const currentHost = window.location.hostname;  // ホスト名（ドメイン名）
    

    // プロジェクト情報を取得する関数
    const GetMeetingInfoFromId = async () => {
        try {
            const response = await fetch(`https://${currentHost}/api/FB/GetMeetingInfoFromId`, {
            // const response = await fetch("http://localhost:8080/FB/GetMeetingInfoFromId", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "user_id": loginUser.uid,
                    "project_id": CurrentProjectID,
                    "meeting_id": meeting_id
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setMeetingName(data.meeting_name);
                setMeetingDescription(data.meeting_description);
            } else {
                throw new Error(`Error: ${response.status}`);
            }
        } catch (error) {
            console.error("Failed to send transcript to API:", error);
        }
    };


    // コンポーネントの初回レンダリング時にGetProjectInfoFromIdを実行
    useEffect(() => {
        if (meeting_id && loginUser.uid) {
            console.log("update meeting info");
            GetMeetingInfoFromId();
        }
    }, [CurrentProjectID, loginUser.uid]); // project_id または UserID が変更されたときにも再実行

    return (
        <div className="MeetingList_container">
            <div className="Meeting_content">
                <div className="Meeting_days">
                    <h5 className="Meeting_date">{MeetingName}</h5>
                    <p className="Meeting_time">{MeetingDescription}</p>
                </div>
                <div className="Meeting_buttons">
                    <button onClick={togglePlayPause}>
                        <img 
                            src={isPlaying ? "/images/Pause.svg" : "/images/Play.svg"} 
                            alt="Play/Pause Icon" 
                            height="40" 
                        />
                        <p>{isPlaying ? "Pause" : "Play"}</p>
                    </button>
                    <button>
                        <img src="/images/minutes.svg" alt="DiscussPlanner Logo" height="40" />
                        <p>議事録</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
