import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectCreate.css"; // CSSファイルをインポート
import { useIdListContext } from "./IdListContext";
import { useUserAuthContext } from "./UserAuthContext";


export default function ProjectCreate() {
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

    const {UserID} = useUserAuthContext();
    const [ProjectName, setProjectName] = useState("");
    const [ProjectDescription, setProjectDescription] = useState("");
    const [AIsRole, setAIsRole] = useState("");
    const { GetALLProjectId, setCurrentProjectID } = useIdListContext();
    const currentHost = window.location.hostname;  // ホスト名（ドメイン名）


    const ClickedCreateProject = async() => {
        const { v4: uuidv4 } = require('uuid');
        const project_id = uuidv4();
        try {
            const response = await fetch(`https://${currentHost}/api/FB/WriteProjectId`, {
            // const response = await fetch("http://localhost:8080/FB/WriteProjectId", {
            
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                        "user_id": UserID,
                        "project_id": project_id,
                        "project_name": ProjectName,
                        "project_description": ProjectDescription,
                        "ai_role": AIsRole
                }),
            });

            if (response.ok) {
                alert("Success create project");
                GetALLProjectId({user_id: UserID});
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
                <input type="text" placeholder="プロジェクトのタイトルを入力してください" value={ProjectName} onChange={(e) => setProjectName(e.target.value)}/>
            </div>
            <div className="Create_content">
                <div>
                    <div className="Create_details">
                        <textarea placeholder="プロジェクトの内容を入力してください" className="input-textarea" value={ProjectDescription} onChange={(e) => setProjectDescription(e.target.value)}/>
                    </div>
                    <div className="Create_AI">
                        <textarea placeholder="AIの役割を入力してください" className="input-textarea" value={AIsRole} onChange={(e) => setAIsRole(e.target.value)}/>
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
                        <p>AIの性格</p>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={percentage2}
                            onChange={handleChange2}
                        />
                        <p>AIの声の高さ</p>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={percentage3}
                            onChange={handleChange3}
                        />
                        <p>AIが話す速度</p>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={percentage4}
                            onChange={handleChange4}
                        />
                    </div>
                    <div>
                        <button className="create-button" onClick={ClickedCreateProject}>プロジェクトを作成</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
