import React, { useEffect, useState } from "react";

import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";

import { useMicContext } from "./MicContext";
import ChatDrawer from './ChatDrawer';
import { useDrawerContext } from './DrawerContext';
import { useFastAPIContext } from "./FastAPIContext";

export default function AIAgentsImage() {
    const { micmute, SetMute, toggleListening, questionstartListening, stopListening } = useMicContext();
    const [faceclicked, Setfaceclicked] = useState(false);
    const { chatopen, toggleDrawer, responsecheck, SetResponseCheck } = useDrawerContext();
    const { AIMessage, SetAIMessage, addDocuments } = useFastAPIContext();

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

    const gijiroku_restartListening = () => {
        setTimeout(() => {
            toggleListening();
        }, 500); // 500ms 後に再開
    };

    const Resetchat = async () => {
        await resetTranscript();
    };

    const sendToAPI = async (transcript) => {
        try {
            const response = await fetch("http://127.0.0.1:8080/chat/111", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "chat": {
                        "message": transcript
                    }
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const ResponseMessage = data.chat.message;
                console.log(data);
                SetResponseCheck(true);
                SetAIMessage(ResponseMessage);
                console.log('Response from API:', ResponseMessage);
                addDocuments(ResponseMessage);
            } else {
                SetResponseCheck(false);
                throw new Error(`Error: ${response.status}`);
            }
        } catch (error) {
            SetResponseCheck(false);
            console.error("Failed to send transcript to API:", error);
        }
    };

    const FaceClick = () => {
        Setfaceclicked(true);
        const uttr = new SpeechSynthesisUtterance("どうされましたか？")
        speechSynthesis.speak(uttr);
        resetTranscript();
        SetMute(false);
        setTimeout(() => {
            questionstartListening();
        }, 100); // 100ms 後に開始
    };

    // 音声認識が終了したら transcript を送信
    useEffect(() => {
        if (transcript.includes('質問は以上です') && faceclicked) {
            console.log("Transcript detected:", transcript);
            Setfaceclicked(false);
            stopListening();

            // 最新の transcript を直接使用してドキュメントに追加
            addDocuments(transcript);
            sendToAPI(transcript);

            // Transcript をリセットし、再度リスニングを開始
            setTimeout(() => {
                Resetchat();
                gijiroku_restartListening();
            }, 100);
        }
    }, [transcript, faceclicked]);

    return (
        <div>
            <img src="./images/AIAgentImage.svg" style={imgstyle} onClick={FaceClick}></img>
            <ChatDrawer transcript={transcript} resetTranscript={resetTranscript} ailisteningnow={faceclicked} />
        </div>
    );
}
