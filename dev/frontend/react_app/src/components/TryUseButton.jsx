
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import { useUserAuthContext } from "./UserAuthContext";
import { useUserAuthContext } from "./UserAuthContext";

export const TryUseButton = () => {
  const navigate = useNavigate();
  const GotoNextPage = () => {
    if (loginUser) {
      navigate("/ProjectPage")
    }
    else {
      navigate("/LoginPage")
    }
    // navigate("/DiscussPage")
  }
  const { loginUser } = useUserAuthContext();
  const Buttonstyle = {
    width: "30%",
    height: "100%",
    borderRadius: "50px",
    background:
      "linear-gradient(180deg, rgb(36,99,235) 0%, rgb(0,208.25,255) 100%)",
    boxShadow: "0px 4px 4px #00000040",
    fontSize: "1.8vw",
    fontWeight: "bold",
    fontFamily: "'Inter', Helvetica"
  };

  return (
    <div>
      <Button variant="contained" sx={Buttonstyle} onClick={GotoNextPage}            >
        使ってみる
      </Button>
    </div>
  );
};