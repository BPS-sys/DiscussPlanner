import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MeetingList.css";
import Meeting from "./Meeting";
import { useIdListContext } from "./IdListContext";
import { useUserAuthContext } from "./UserAuthContext";

export default function MeetingList() {

    const Times = {
        day: '2024//03/09',
        time: '11:30~12:00'
    };

    const { ALLMeetingIdList, GetALLMeetingId, CurrentProjectID } = useIdListContext();
    const { loginUser } = useUserAuthContext();

    const update = () => {
        GetALLMeetingId({ user_id: loginUser.uid, project_id: CurrentProjectID });
    };
    useEffect(() => {
        update();
        console.log("get all meeting id");
    }, []);

    return (
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {ALLMeetingIdList.flat().map((meeting_id) => (
                <Meeting key={meeting_id} meeting_id={meeting_id} />
            ))}
        </div>
    );
}
