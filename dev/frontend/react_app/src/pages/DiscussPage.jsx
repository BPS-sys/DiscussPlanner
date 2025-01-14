
import MainAppBar from "../components/MainAppBar";
import AIAgentsImage from "../components/AIAgentsImage";
import { Timer } from "../components/Timer";
import ToolBar from "../components/ToolBar";
import CallEnd from "../components/CallEnd";
import { Whiteboard } from "../components/WhiteBoard";




const DiscussPage = () =>{
    return (
        <div>
            <MainAppBar></MainAppBar>
            <AIAgentsImage></AIAgentsImage>
            <Timer></Timer>
            <ToolBar></ToolBar>
            <CallEnd></CallEnd>
            <Whiteboard></Whiteboard>
        </div>
    );
};

export default DiscussPage;