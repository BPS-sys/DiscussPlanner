
import React from "react";

export const Whiteboard = () => {
    const [pos, setPos] = React.useState({ x: 0, y: 0 });
    const [text, setText] = React.useState("Wash your hands clean!");
    const [Editing, setEditMode] = React.useState(false);
    const handleDrop = (e) => {
        const boardRect = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - boardRect.left, y: e.clientY - boardRect.top })
    };
    return (
      <div
        style={{ width: "1200px", height: "900px", position: "absolute", top:'100px', left:'500px', backgroundColor:'gray'}}
        onDrop={ handleDrop }
        onDragOver={(e) => e.preventDefault()} // enable onDrop event
      >
        <div style={{ position: "absolute", top: pos.y + "px", left: pos.x + "px" }} draggable={true}>
            {Editing ?
            (<textarea onBlur={(e) => setEditMode(false)} onChange={(e) => setText(e.target.value)} defaultValue={text}/>):
            (<div onClick={(e) => setEditMode(true)}>{text}</div>)}
        </div>
      </div>
    );
  };
  