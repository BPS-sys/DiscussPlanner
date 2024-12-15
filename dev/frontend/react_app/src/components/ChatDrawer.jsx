import { React, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { Firestore } from 'firebase/firestore';
import { doc, getDoc } from "firebase/firestore"; 
import { collection, getDocs } from 'firebase/firestore';
import db from '../firebase';
import { useDrawerContext } from './DrawerContext';

export default function ChatDrawer() {
  const { chatopen, toggleDrawer, responsecheck, SetResponseCheck} = useDrawerContext();
  const [documents, setDocuments] = useState([]);
  const addDocuments = (newdoc) => {
    console.log(documents.length);
    if (documents.length !== 0) {
      setDocuments(prevdoc => ["###", prevdoc, "###", newdoc]);
    }
    else {
      setDocuments(prevdoc => [prevdoc, "###", newdoc]);
    };
    
  }

  const GetFirebase = async () => {
    try {
      // 'chatdata' コレクションからデータを取得
      const docRef = doc(db, "testuser", "b01ADn1oC6B41T57lqP6", "log", "XCWdWHX1f536cqBsgcpU");
      const docSnap = await getDoc(docRef);
      const messageMap = docSnap.data().Message;
      Object.entries(messageMap).forEach(([key, value]) => {
        console.log(value.content);
        addDocuments(value.content)
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

  const DrawerList = (
    <Box sx={{ width: 550 }} role="presentation">
      <h2>Firestore Documents</h2>
      {/* Firestoreから取得したドキュメントを表示 */}
      {documents.length > 0 ? (<p>{documents}</p>) : (<p>No documents found.</p>)}
    </Box>
  );

  return (
    <Drawer open={chatopen} onClose={toggleDrawer(false)} anchor='right' ModalProps={{
      BackdropProps: {
        style: { backgroundColor: 'transparent' }
      }}}>
      {DrawerList}
    </Drawer>
  );
}
