import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectCreate.css"; // CSSファイルをインポート

export default function ProjectCreate() {
    const navigate = useNavigate();
    const GotoMeetingPage = () => {
        navigate("/MeetingPage")
    }
    const [percentage1, setPercentage1] = useState(50);
    const [percentage2, setPercentage2] = useState(50);
    const [percentage3, setPercentage3] = useState(50);
    const [percentage4, setPercentage4] = useState(50);
    
    const handleChange1 = (e) => {
        // console.log("スライダー1の値:", e.target.value);
        setPercentage1(e.target.value);
    };
    const handleChange2 = (e) => {
        setPercentage2(e.target.value);
    };
    const handleChange3 = (e) => {
        setPercentage3(e.target.value);
    };
    const handleChange4 = (e) => {
        setPercentage4(e.target.value);
    };

    

    return (
        <div className="Create_container">
            <div className="Create_title">
                <input type="text" placeholder="会議のタイトルを入力してください" />
            </div>
            <div className="Create_content">
                <div>
                    <div className="Create_details">
                        <textarea placeholder="会議の内容を入力してください" className="input-textarea" />
                    </div>
                    <div className="Create_AI">
                        <textarea placeholder="AIの役割を入力してください" className="input-textarea" />
                    </div>
                </div>
                <div className="Create_parameters">
                    <h4>AIの特性</h4>
                    <div className="AI_gauge">
                        <p>template</p>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={percentage1}
                            onChange={handleChange1}
                        />
                        <p>template</p>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={percentage2}
                            onChange={handleChange2}
                        />
                        <p>template</p>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={percentage3}
                            onChange={handleChange3}
                        />
                        <p>template</p>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={percentage4}
                            onChange={handleChange4}
                        />
                    </div>
                    <div>
                        <button className="create-button" onClick={GotoMeetingPage}>会議室を作成</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
