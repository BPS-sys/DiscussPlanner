import React, { useState } from "react";
import Project from "../components/Project";
import ProjectCreate from "../components/ProjectCreate";
import "./ProjectList.css";

export default function ProjectList() {
    const [isPopupVisible, setPopupVisible] = useState(false);

    const togglePopup = () => {
        setPopupVisible(!isPopupVisible);
    };

    return (
        <div>
            {/* プロジェクトリスト */}
            <Project />
            <Project />
            <Project />
            <Project />
            <Project />

            {/* ポップアップを表示するボタン */}
            <button className="Create_button" onClick={togglePopup}>新しいプロジェクトを作成</button>

            {/* ポップアップ */}
            {isPopupVisible && (
                <div className="popup_overlay" onClick={togglePopup}>
                    <div className="popup_content" onClick={(e) => e.stopPropagation()}>
                        <button className="close_button" onClick={togglePopup}>
                            ✕
                        </button>
                        <ProjectCreate />
                    </div>
                </div>
            )}
        </div>
    );
}
