import React, { useEffect, useState } from "react";
import { useChatPropatiesContext } from "./ChatPropatiesContext";

export const Whiteboard = () => {
  const [cards, setCards] = React.useState({});
  const updateCard = (cardId, cardData) => setCards({ ...cards, [cardId]: cardData });
  const addCard = () => {
    const { v4: uuidv4 } = require("uuid");
    const newid = uuidv4();
    setCards({ ...cards, [newid]: { text: "新規", x: 100, y: 100, backgroundColor: "yellow" } });
  };

  const [draggingCard, setDraggingCard] = React.useState({ id: "", offsetX: 0, offsetY: 0 });
  const [editMode, setEditMode] = React.useState({ id: "" });
  const { GotIdea, OnBoardIdea, setIdeaOnBoard } = useChatPropatiesContext();

  const ReDraw = async () => {
    if (GotIdea.length !== 0) {
      for (const text of GotIdea.flat()) {
        const { v4: uuidv4 } = require("uuid");
        const newid = uuidv4();
        setCards((prevCards) => ({
          ...prevCards,
          [newid]: { text: text, x: 100, y: 100, backgroundColor: "yellow" },
        }));
      }
    }
  };

  useEffect(() => {
    ReDraw();
  }, [GotIdea]);

  useEffect(() => {
    const texts = Object.values(cards).map((card) => card.text);
    setIdeaOnBoard(texts);
  }, [cards]);

  return (
    <div
      style={{
        width: "50vw", // 画面幅の2,3分割目に相当する幅 (画面の半分)
        height: "80vh", // 高さは90%とする
        position: "absolute", // 絶対配置
        top: "10vh", // 上部から5%の位置
        left: "20vw", // 左から2分割目の開始位置
        backgroundColor: "#ececec", // 背景色
        overflowY: "auto", // 縦スクロールを有効化
        border: "1px solid #ccc", // 境界線
        borderRadius: "8px", // 角を丸くする
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // 影
        zIndex: 1000, // 他の要素より前面に表示
      }}
      onClick={(e) => e.stopPropagation()} // クリックイベントの伝播を停止
      onDrop={(e) => {
        e.stopPropagation(); // ドロップイベントの伝播を停止
        if (!draggingCard.id || !cards[draggingCard.id]) return;
        updateCard(draggingCard.id, {
          ...cards[draggingCard.id],
          x: e.clientX - draggingCard.offsetX,
          y: e.clientY - draggingCard.offsetY,
        });
      }}
      onDragOver={(e) => e.preventDefault()}
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
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
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
      <button
        onClick={addCard}
        style={{
          fontSize: "40px",
          position: "absolute",
          left: "5px",
          top: "5px",
          width: "50px",
          height: "50px",
        }}
      >
        +
      </button>
    </div>
  );
  
};
