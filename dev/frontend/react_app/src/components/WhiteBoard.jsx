import React, { useEffect, useState } from "react";
import { useChatPropatiesContext } from "./ChatPropatiesContext";

export const Whiteboard = () => {
  const [cards, setCards] = React.useState({
  });
  const updateCard = (cardId, cardData) => setCards({ ...cards, [cardId]: cardData });
  const addCard = () => {
    const { v4: uuidv4 } = require('uuid');
    const newid = uuidv4();
    setCards({ ...cards, [newid]: { text: "新規", x: 300, y: 300, backgroundColor: "yellow" } });
    console.log(cards)
  };
  

  const [draggingCard, setDraggingCard] = React.useState({ id: "", offsetX: 0, offsetY: 0 });
  const [editMode, setEditMode] = React.useState({ id: "" });
  const { GotIdea, OnBoardIdea, setIdeaOnBoard } = useChatPropatiesContext();
  const ReDraw = async() => {
    if (GotIdea.length !== 0) {
      for (const text of GotIdea.flat()) {
        const { v4: uuidv4 } = require("uuid");
        const newid = uuidv4();
        setCards((prevCards) => ({
          ...prevCards,
          [newid]: { text: text, x: 300, y: 300, backgroundColor: "yellow" },
        }));
      }
    };
  };

  useEffect(() => {
    ReDraw();
  }, [GotIdea]);

  useEffect(() => {
    const texts = Object.values(cards).map((card) => card.text);
    console.log("textsss", {texts});
    setIdeaOnBoard(texts);
  }, [cards]);

  return (
    <div
      style={{
        width: "1000px",
        height: "580px",
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
      <button onClick={addCard} style={{ fontSize: '40px', position: 'absolute', left: 0, width: '50px', height: '50px' }}>+</button>
    </div>
  );
};
