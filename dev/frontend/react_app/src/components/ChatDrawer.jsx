import { React, useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { doc, getDoc } from "firebase/firestore";
import db from '../firebase';
import { useDrawerContext } from './DrawerContext';
import { Typography, Paper } from '@mui/material';

export default function ChatDrawer({ transcript, resetTranscript, ailisteningnow }) {
  const { chatopen, toggleDrawer, responsecheck, SetResponseCheck } = useDrawerContext();
  const [documents, setDocuments] = useState([]);
  const scrollRef = useRef(null);  // スクロール位置を管理するためのref

  const addDocuments = (newdoc) => {
    setDocuments(prevdoc => [...prevdoc, newdoc]);
  };

  const addDocumentsRealtime = (doc) => {
    let updatedDocs = [...documents];  // 新しい配列を作成
    if (updatedDocs.length === 0) {
      updatedDocs = [doc];  // 配列が空なら新しいドキュメントで初期化
    } else {
      updatedDocs[updatedDocs.length - 1] = doc;  // 最後の要素を新しいdocに置き換え
    }
    setDocuments(updatedDocs);
  }

  const GetFirebase = async () => {
    try {
      // Firestoreからメッセージデータを取得
      const docRef = doc(db, "testuser", "b01ADn1oC6B41T57lqP6", "log", "XCWdWHX1f536cqBsgcpU");
      const docSnap = await getDoc(docRef);
      const messageMap = docSnap.data().Message;

      // messageMapをid順にソート
      const sortedMessages = Object.entries(messageMap)
        .map(([key, value]) => ({ id: value.id, content: value.content }))
        .sort((a, b) => a.id - b.id);
      await setDocuments([])
      // ソートされたメッセージをdocumentsに追加
      sortedMessages.forEach(message => {
        addDocuments(message.content);
      });
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  useEffect(() => {
    if (responsecheck) {
      SetResponseCheck(false);
      GetFirebase();
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
    <Box sx={{ width: 550, padding: 2, maxHeight: '400px', overflowY: 'auto' }} role="presentation" ref={scrollRef}>
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
            <Paper
              sx={{
                padding: 1,
                backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#e0e0e0',
                maxWidth: '80%',
                borderRadius: 2,
                display: 'inline-block',
                wordBreak: 'break-word',
                boxShadow: 2,
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
            {ailisteningnow? <Typography variant="body1">{transcript}</Typography> : <div></div>}
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
