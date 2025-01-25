import React from "react";
import { useNavigate } from "react-router-dom";
import "./Project.css";

export default function Project() {
    const navigate = useNavigate();
    const GotoMeetingPage = () => {
        navigate("/MeetingPage")
    }
    return (
        <div className="Project_container">
            <div className="card">
                <h3 className="card_title">プロジェクトタイトル</h3>
                <div className="card_content">
                    <p>
                        プロジェクトの説明
                    </p>
                    <p>
                        この会議では、AIに関する新たなソリューション開発を行います。
                    </p>
                </div>

                <div className="card_under">
                    <div className="button_group">
                        <button className="primary_button" onClick={GotoMeetingPage} >
                            会議を開始する
                        </button>
                        <button className="secondary_button">
                            Details
                        </button>
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
