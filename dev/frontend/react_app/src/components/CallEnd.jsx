
import CallEndIcon from '@mui/icons-material/CallEnd';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { useNavigate } from "react-router-dom";


export default function CallEnd() {
    const navigate = useNavigate();
    const GotoHome = () => {
        navigate('/')
    }
    return (
        <div>
            <Toolbar style={{background:"linear-gradient(90deg, rgb(34, 102, 235) 0%, rgb(2, 203, 254) 100%)", borderRadius:500, width:80, height:125, position:'absolute', right:30, bottom:10}}>
                <IconButton onClick={GotoHome}>
                    <CallEndIcon style={{color:'white', fontSize:'65px', textAlign:'center'}} />
                </IconButton>
            </Toolbar>
        </div>
    );
};