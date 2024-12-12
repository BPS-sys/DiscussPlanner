import { width } from "@mui/system";

export const DescriptionDPLetter = () => {
  const divstyle = {
    height: '36vw', 
    width:'50vw',
  };

  const h1style = {
    marginTop:'8vw',
    display:'flex',
    color: "#2463eb",
    fontSize: '6vw'
  };

  const pstyle = {
    display:'flex',
    color: "#4294ff",
    fontSize: '3vw',
    fontWeight: '600',
    textAlign: 'left'
  };

  return (
    <div style={divstyle}>
      <h1 style={h1style}>
        DiscussPlanner
      </h1>
      <p style={pstyle}>
        もう会議進行に<br></br>失敗することはありません！
      </p>
    </div>
  );
};