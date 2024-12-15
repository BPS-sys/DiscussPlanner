
import React, { useEffect, useState } from "react";

import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";

import { useMicContext } from "./MicContext";
import ChatDrawer from './ChatDrawer';
import { useDrawerContext } from './DrawerContext';


export default function AIAgentsImage() {
    const { micmute, SetMute, toggleListening, _ } = useMicContext();
    const [ faceclicked, Setfaceclicked ] = useState(false);
    const { chatopen, toggleDrawer, responsecheck, SetResponseCheck} = useDrawerContext();

    const imgstyle = {
        position: "absolute",
        top: 100,
        left: 50,
        width: 300
    };
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    const startListening = () => {
        SpeechRecognition.startListening({ language: "ja-JP" });
    };

    const gijiroku_restartListening = () => {
        SetMute(micmute);
        setTimeout(() => {
            toggleListening();
        }, 500); // 500ms 後に実行
        
    };

    const stopListening = () => {
        SpeechRecognition.stopListening();
    };

    const sendToAPI = async (transcript) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/send-chatdata", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ transcript }),
            });

            if (!response.ok) {
                SetResponseCheck(false);
                throw new Error(`Error: ${response.status}`);
            }
            else {
                SetResponseCheck(true);
            };

            const data = await response.json();
            console.log("Response from server:", data);
        } catch (error) {
            SetResponseCheck(false);
            console.error("Failed to send transcript to API:", error);
        }
    };

    const FaceClick = () => {
        Setfaceclicked(true);
        const uttr = new SpeechSynthesisUtterance("どうされましたか？")
        speechSynthesis.speak(uttr)
        resetTranscript()
        SetMute(false);
        setTimeout(() => {
            startListening();
        }, 500); // 500ms 後に実行
        
    };

    // 音声認識が終了したら transcript を送信
    useEffect(() => {
        if (transcript.includes('以上です') && faceclicked) {
            Setfaceclicked(false);
            stopListening();
            sendToAPI(transcript);
            setTimeout(() => {
                gijiroku_restartListening();
            }, 500); // 500ms 後に実行
        }
    }, [transcript]);

    return (
        <div>
            <img src="./images/AIAgentImage.svg" style={imgstyle} onClick={FaceClick}></img>
            <h1>{transcript}</h1>
            <ChatDrawer />
        </div>
    );
};