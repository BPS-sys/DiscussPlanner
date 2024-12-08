
import { Button } from "@mui/material";

export const TryUseButton = () => {
    return (
      <div>
        <Button
              variant="contained"
              sx={{
                width: "30%",
                height: "100%",
                borderRadius: "50px",
                background:
                  "linear-gradient(180deg, rgb(36,99,235) 0%, rgb(0,208.25,255) 100%)",
                boxShadow: "0px 4px 4px #00000040",
                fontSize: "2rem",
                fontWeight: "bold",
                fontFamily: "'Inter', Helvetica",
                top:500
              }}
            >
              使ってみる
            </Button>
      </div>
    );
  };