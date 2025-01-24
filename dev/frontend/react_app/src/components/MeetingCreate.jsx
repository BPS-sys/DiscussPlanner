import React from "react";
import { useNavigate } from "react-router-dom";
import "./MeetingCreate.css";



export default function MeetingCreate() {

    const navigate = useNavigate();
    const GotoDiscussPage = () => {
        navigate("/DiscussPage")
    }

    return (
        <div className="MeetingCreate_container">
            <button className="Pen_button"><img src="./images/pen.svg" alt="" /></button>
            <button className="MeetingCreate_button" onClick={GotoDiscussPage}>会議室を作成</button>
        </div>
    );
}
