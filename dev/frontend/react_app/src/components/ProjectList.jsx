import React, { useEffect, useState } from "react";
import Project from "../components/Project";
import ProjectCreate from "../components/ProjectCreate";
import "./ProjectList.css";
import { useIdListContext } from "./IdListContext";
import { useUserAuthContext } from "./UserAuthContext";


export default function ProjectList() {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const togglePopup = () => {
        setPopupVisible(!isPopupVisible);
    };
    const {UserID} = useUserAuthContext();

    const { ALLProjectIdList, GetALLProjectId } = useIdListContext();

    const update = () => {
        GetALLProjectId({user_id: UserID});
    }

    // useEffect(() => {
    //     console.log("RUN UPDATE");
    //     update();
    // }, [ALLProjectIdList]);

    return (
        <div>
            {/* プロジェクトリスト */}
            {ALLProjectIdList.flat().map((project_id) => (
                <Project project_id={project_id} />
            ))}

            {/* ポップアップを表示するボタン */}
            <button className="Create_button" onClick={togglePopup}>新しいプロジェクトを作成</button>
            <button onClick={update}>更新</button>

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
