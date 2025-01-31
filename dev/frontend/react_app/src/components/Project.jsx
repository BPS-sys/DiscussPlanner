import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Project.css";
import { useUserAuthContext } from "./UserAuthContext";
import { useIdListContext } from "./IdListContext";
import { useChatPropatiesContext } from "./ChatPropatiesContext";
import { useActionState } from "react";

export default function Project({ project_id }) {
    const navigate = useNavigate();

    const { loginUser } = useUserAuthContext();
    const [ProjectName, setProjectName] = useState("");
    const [ProjectDescription, setProjectDescription] = useState("");
    const {setCurrentProjectID} = useIdListContext();
    const { set_project_name, set_project_description, set_ai_role } = useChatPropatiesContext();
    const currentHost = window.location.hostname;  // ホスト名（ドメイン名）


    const GotoMeetingPage = () => {
        setCurrentProjectID(project_id);
        set_project_name(ProjectName);
        set_project_description(ProjectDescription);
        navigate("/MeetingPage");
    }

    // プロジェクト情報を取得する関数
    const GetProjectInfoFromId = async () => {
        try {
            const response = await fetch(`https://${currentHost}/api/FB/GetProjectInfoFromId`, {
            // const response = await fetch("http://localhost:8080/FB/GetProjectInfoFromId", {
            
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "user_id": loginUser.uid,
                    "project_id": project_id,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setProjectName(data.project_name);
                setProjectDescription(data.project_description);
                set_ai_role(data.ai_role)
                console.log("Project Info:", { ProjectName, ProjectDescription });
            } else {
                throw new Error(`Error: ${response.status}`);
            }
        } catch (error) {
            console.error("Failed to send transcript to API:", error);
        }
    };


    // コンポーネントの初回レンダリング時にGetProjectInfoFromIdを実行
    useEffect(() => {
        if (project_id && loginUser.uid) {
            console.log("update project info");
            GetProjectInfoFromId();
        }
    }, [project_id, loginUser.uid]); // project_id または UserID が変更されたときにも再実行

    return (
        <div className="Project_container">
            <div className="card">
                <h3 className="card_title">{ProjectName}</h3>
                <div className="card_content">
                    <p>{ProjectDescription}</p>
                </div>
                <div className="card_under">
                    <div className="button_group">
                        <button className="primary_button" onClick={GotoMeetingPage} >
                            開く
                        </button>
                        <button className="secondary_button">Option</button>
                    </div>
                    <div className="icon_container">
                        <div className="icon">1</div>
                        <div className="icon">2</div>
                        <div className="icon">3</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
