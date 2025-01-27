import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MeetingCreate.css";
import MeetingPopup from "./MeetingPopup";




export default function MeetingCreate() {

    const navigate = useNavigate();
    const GotoDiscussPage = () => {
        navigate("/DiscussPage")
    }
    const [isPopupVisible, setPopupVisible] = useState(false);
    const togglePopup = () => {
        setPopupVisible(!isPopupVisible);
    };

    return (
        <div className="MeetingCreate_container">

            <button className="Pen_button"><img src="./images/pen.svg" alt="" /></button>
            {/* <button onClick={update}>更新</button> */}

            {/* ポップアップ */}
            {isPopupVisible && (
                <div className="popup_overlay" onClick={togglePopup}>
                    <div className="popup_content" onClick={(e) => e.stopPropagation()}>
                        <button className="close_button" onClick={togglePopup}>
                            ✕
                        </button>
                        <MeetingPopup />
                    </div>
                </div>
            )}
            <button className="MeetingCreate_button" onClick={togglePopup}>会議室を作成</button>
        </div >
    );
}
