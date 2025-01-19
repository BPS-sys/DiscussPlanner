import React from "react";

export const Whiteboard = () => {
  const [cards, setCards] = React.useState({
    id0: { text: "ID0message", x: 100, y: 100, backgroundColor:"yellow" },
    id1: { text: "ID1message", x: 200, y: 300, backgroundColor:"yellow" },
  });
  const updateCard = (cardId, cardData) => setCards({ ...cards, [cardId]: cardData });
  const addCard = () => {
    const newid = `id${Object.keys(cards).length}`
    setCards({...cards, [newid]: { text: `${newid}message`, x: 300, y: 300, backgroundColor:"yellow"  }});
    console.log(cards)
  };

  const [draggingCard, setDraggingCard] = React.useState({ id: "", offsetX: 0, offsetY: 0 });
  const [editMode, setEditMode] = React.useState({ id: "" });

  return (
    <div
      style={{
        width: "1000px",
        height: "600px",
        position: "absolute",
        top: "100px",
        left: "280px",
        backgroundColor: "#ececec",
        overflow: "hidden"
      }}
      onDrop={(e) => {
        if (!draggingCard.id || !cards[draggingCard.id]) return;
        updateCard(draggingCard.id, {
          ...cards[draggingCard.id],
          x: e.clientX - draggingCard.offsetX,
          y: e.clientY - draggingCard.offsetY,
        });
        console.log({ ...cards[draggingCard.id] });
      }}
      onDragOver={(e) => e.preventDefault()} // enable onDrop event
    >
      {Object.keys(cards).map((cardId) => (
        <div
          key={cardId}
          style={{
            position: "absolute",
            top: cards[cardId].y + "px",
            left: cards[cardId].x + "px",
            padding: "4px",
            width: "100px",
            height: "100px",
            fontSize: "14px",
            backgroundColor: cards[cardId].backgroundColor,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
  
          }}
          draggable={true}
          onDragStart={(e) =>
            setDraggingCard({
              id: cardId,
              offsetX: e.clientX - cards[cardId].x,
              offsetY: e.clientY - cards[cardId].y,
            })
          }
        >         
          {editMode.id === cardId ? (
            <textarea
              onBlur={() => setEditMode({ id: "" })}
              onChange={(e) => updateCard(cardId, { ...cards[cardId], text: e.target.value })}
              defaultValue={cards[cardId].text}
            />
          ) : (
            <div onClick={() => setEditMode({ id: cardId })}>{cards[cardId].text}</div>
          )}
        </div>
      ))}
      <button onClick={addCard} style={{fontSize:'40px', position:'absolute', left:0, width: '50px', height:'50px'}}>+</button>
    </div>
  );
};
