
import MainAppBar from "../components/MainAppBar";
import AIAgentsImage from "../components/AIAgentsImage";
import { Timer } from "../components/Timer";
import ToolBar from "../components/ToolBar";
import CallEnd from "../components/CallEnd";
import { Whiteboard } from "../components/WhiteBoard";
import { useLocation } from "react-router-dom";
import { DrawSchedule } from "../components/DrawSchedule";




const DiscussPage = () =>{
    const location = useLocation();
    const data = location.state?.data; // 渡されたデータを取得
    console.log(data);
    const timeList = data.TaskList.map((task) => task.metadata.time);


    return (
        <div>
            <MainAppBar></MainAppBar>
            <AIAgentsImage></AIAgentsImage>
            <Timer timelist={timeList}></Timer>
            <DrawSchedule data={data}></DrawSchedule>
            <ToolBar></ToolBar>
            <CallEnd></CallEnd>
            <Whiteboard></Whiteboard>
        </div>
    );
};

export default DiscussPage;