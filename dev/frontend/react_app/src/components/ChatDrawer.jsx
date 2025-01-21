import { React, useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { doc, getDoc } from "firebase/firestore";
import db from '../firebase';
import { useDrawerContext } from './DrawerContext';
import { Typography, Paper } from '@mui/material';
import { useFastAPIContext } from './FastAPIContext';
import { Avatar } from '@mui/material';

export default function ChatDrawer({ transcript, resetTranscript, ailisteningnow }) {
  const { chatopen, toggleDrawer, responsecheck, SetResponseCheck } = useDrawerContext();
  const { UserMessage, SetUserMessage, AIMessage, SetAIMessage, documents, setDocuments, addDocuments } = useFastAPIContext();
  const scrollRef = useRef(null);  // スクロール位置を管理するためのref

  // const addDocumentsRealtime = (doc) => {
  //   let updatedDocs = [...documents];  // 新しい配列を作成
  //   if (updatedDocs.length === 0) {
  //     updatedDocs = [doc];  // 配列が空なら新しいドキュメントで初期化
  //   } else {
  //     updatedDocs[updatedDocs.length - 1] = doc;  // 最後の要素を新しいdocに置き換え
  //   }
  //   setDocuments(updatedDocs);
  // }

  // const GetFirebase = async () => {
  //   try {
  //     // Firestoreからメッセージデータを取得
  //     const docRef = doc(db, "testuser", "b01ADn1oC6B41T57lqP6", "log", "XCWdWHX1f536cqBsgcpU");
  //     const docSnap = await getDoc(docRef);
  //     const messageMap = docSnap.data().Message;

  //     // messageMapをid順にソート
  //     const sortedMessages = Object.entries(messageMap)
  //       .map(([key, value]) => ({ id: value.id, content: value.content }))
  //       .sort((a, b) => a.id - b.id);
  //     await setDocuments([])
  //     // ソートされたメッセージをdocumentsに追加
  //     sortedMessages.forEach(message => {
  //       addDocuments(message.content);
  //     });
  //   } catch (error) {
  //     console.error("Error getting documents: ", error);
  //   }
  // };

  useEffect(() => {
    if (responsecheck) {
      SetResponseCheck(false);
    }
  }, [responsecheck]);

  useEffect(() => {
    // メッセージが更新されるたびにスクロール位置を下に移動
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [documents]);

  // useEffect(() => {
  //   if (transcript) {
  //     addDocumentsRealtime(transcript); // ユーザーの発言をdocumentsに追加
  //   }
  // }, [transcript]);

  // チャットログを表示する
  const DrawerList = (
    <Box 
    sx={{
      width: 550, 
      padding: 2, 
      maxHeight: '100%', 
      overflowY: 'auto', 
      '&::-webkit-scrollbar': {
        width: '8px', // スクロールバーの幅
      },
      '&::-webkit-scrollbar-track': {
        background: '#f1f1f1', // スクロールバーのトラック（背景）
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'linear-gradient(90deg, rgb(34, 102, 235) 0%, rgb(2, 157, 254) 100%)', // スクロールバーのつまみ部分
        borderRadius: '4px', // つまみの角を丸く
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#555', // つまみをホバーしたときの色
      }
    }} 
    role="presentation" 
    ref={scrollRef}
  >
      <Typography variant="h6" gutterBottom>Chat</Typography>
      {documents.length > 0 ? (
        documents.map((doc, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: index % 2 === 0 ? 'flex-end' : 'flex-start', // ユーザーは右側、AIは左側
              marginBottom: 2,
            }}
          >
            {index % 2 === 1 && (  
              <Avatar 
                sx={{ 
                  marginRight: 2, 
                  width: 40, 
                  height: 40, 
                  backgroundColor: 'rgb(34, 102, 235)' 
                }}
              >
                <img src='./images/AIicon.svg'></img>
              </Avatar>
            )}
            <Paper
              sx={{
                padding: 1,
                background: index % 2 === 0 ? 'linear-gradient(90deg, rgb(34, 102, 235) 0%, rgb(2, 157, 254) 100%)' : '#f5f5f5', // ユーザーに線形グラデーションを適用
                color: index % 2 === 0 ? '#ffffff' : '#000000', // テキストの色を変更
                maxWidth: '70%', // 最大幅を変更
                borderRadius: 4, // 角を丸くする
                display: 'inline-block',
                wordBreak: 'break-word',
                boxShadow: 5, // ボックスシャドウを変更
                padding: 1.2,
              }}
            >
              <Typography variant="body1">{doc}</Typography>
            </Paper>

          </Box>
        ))
      ) : (
        <Typography variant="body2" color="textSecondary">No documents found.</Typography>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end', // ユーザーは右側、AIは左側
          marginBottom: 2,
        }}
      >
        <Paper
          sx={{
            padding: 1,
            backgroundColor: '#f0f0f0', // ユーザーの発言と同じデザイン
            maxWidth: '80%',
            borderRadius: 2,
            display: 'inline-block',
            wordBreak: 'break-word',
            boxShadow: 2,
          }}
        >
          {ailisteningnow ? <Typography variant="body1">{transcript}</Typography> : <div></div>}
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Drawer open={chatopen} onClose={toggleDrawer(false)} anchor="right" ModalProps={{
      BackdropProps: {
        style: { backgroundColor: 'transparent' }
      }
    }}>
      {DrawerList}
    </Drawer>
  );
}