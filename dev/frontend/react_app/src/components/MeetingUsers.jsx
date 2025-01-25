import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MeetingUsers.css";

export default function MeetingUsers() {
    const User = {
        icon: './images/Usericon.svg',
        name: '山田 太郎'
    };

    return (
        <div className="MeetingUsers_container">
            <div className="MeetingUsers_top">
                <h3 className="MeetingUsers_title">Users</h3>
                <button className="MeetingUsers_add"><img src="./images/Plus.svg" alt="" height="40px" /></button>
            </div>

            <div className="User_list">
                <div className="User_content">
                    <img src={User.icon} alt="" />
                    <p>{User.name}</p>
                </div>

                <div className="User_content">
                    <img src={User.icon} alt="" />
                    <p>{User.name}</p>
                </div>

                <div className="User_content">
                    <img src={User.icon} alt="" />
                    <p>{User.name}</p>
                </div>
                <div className="User_content">
                    <img src={User.icon} alt="" />
                    <p>{User.name}</p>
                </div>

                <div className="User_content">
                    <img src={User.icon} alt="" />
                    <p>{User.name}</p>
                </div>
            </div>


        </div>
    );
}
