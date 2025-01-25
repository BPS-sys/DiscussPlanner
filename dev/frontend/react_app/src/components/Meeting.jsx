import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MeetingList.css";

export default function MeetingList() {

    const Times = {
        day: '2024//03/09',
        time: '11:30~12:00'
    };

    const [isPlaying, setIsPlaying] = useState(false);
    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="MeetingList_container">
            <div className="Meeting_content">
                <div className="Meeting_days">
                    <h5 className="Meeting_date">{Times.day}</h5>
                    <p className="Meeting_time">{Times.time}</p>
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
