
import MainAppBar from "../components/MainAppBar";
import MeetingDetails from "../components/MeetingDetails";
import MeetingList from "../components/MeetingList";
import MeetingUsers from "../components/MeetingUsers";
import MeetingCreate from "../components/MeetingCreate";

const MeetingPage = () => {
    return (
        <div>
            <MainAppBar></MainAppBar>
            <div style={{ display: "flex" }}>
                <div>
                    <MeetingDetails ></MeetingDetails>
                    <MeetingList></MeetingList>
                </div>
                <div>
                    <MeetingUsers></MeetingUsers>

                    <MeetingCreate></MeetingCreate>
                </div>

            </div>
            


        </div>
    );
};

export default MeetingPage;