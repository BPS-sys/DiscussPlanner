
import MainAppBar from "../components/MainAppBar";
import AIAgentsImage from "../components/AIAgentsImage";
import { Timer } from "../components/Timer";
import ToolBar from "../components/ToolBar";
import CallEnd from "../components/CallEnd";



const DiscussPage = () =>{
    return (
        <div>
            <MainAppBar></MainAppBar>
            <AIAgentsImage></AIAgentsImage>
            <Timer></Timer>
            <ToolBar></ToolBar>
            <CallEnd></CallEnd>
        </div>
    );
};

export default DiscussPage;