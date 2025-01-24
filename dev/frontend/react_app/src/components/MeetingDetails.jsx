import React from "react";
import { useNavigate } from "react-router-dom";
import "./MeetingDetails.css";

const Meeting = {
    title: 'ミーティングのタイトル',
    details: 'この会議ではAIに関する新たなソリューション開発を行います。会議は○○室で行い、全力で取り組むものとする。'
};


export default function MeetingDetails() {

   
    
    return (
        <div className="MeetingDetails_container">
            <h1 className="Meeting_title">{Meeting.title}</h1>
            <p className="Meeting_details">{Meeting.details}</p>
        </div>
    );
}
