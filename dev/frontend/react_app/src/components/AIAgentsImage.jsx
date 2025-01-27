import React, { useEffect, useState, useRef } from "react";

import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";

import { useMicContext } from "./MicContext";
import ChatDrawer from './ChatDrawer';
import { useDrawerContext } from './DrawerContext';
import { useFastAPIContext } from "./FastAPIContext";
import { useChatPropatiesContext } from "./ChatPropatiesContext";

export default function AIAgentsImage() {
    const { micmute, SetMute, toggleListening, questionstartListening, stopListening } = useMicContext();
    const [faceclicked, Setfaceclicked] = useState(false);
    const { chatopen, toggleDrawer, responsecheck, SetResponseCheck } = useDrawerContext();
    const { AIMessage, SetAIMessage, addDocuments } = useFastAPIContext();
    const [finalTranscript, setFinalTranscript] = useState(""); // 確定した文章
    const timerRef = useRef(null); // タイマーを格納
    const { project_name, project_description, meeting_name, meeting_description, ai_role, maximum_time, OnBoardIdea, SetGotIdea } = useChatPropatiesContext();

    const imgstyle = {
        position: 'absolute',
        top: '15vh',
        left: '-3vw',
        width: '25vw',
        height: '25vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    };

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    const Minutes_restartListening = () => {
        setTimeout(() => {
            toggleListening();
        }, 500); // 500ms 後に再開
    };

    const Resetchat = async () => {
        await resetTranscript();
    };

    const currentHost = window.location.hostname;  // ホスト名（ドメイン名）


    const UseFastAPITosendUserMessage = async (message) => {
        try {

            const response = await fetch(`https://${currentHost}/api/chat/111`, {
                // const response = await fetch(`http://${currentHost}:8080/chat/111`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "chat": {
                        "message": message
                    },
                    "details": {
                        "ideas": OnBoardIdea
                    },
                    "propaties": {
                        "project_name": project_name,
                        "project_description": project_description,
                        "meeting_name": meeting_name,
                        "meeting_description": meeting_description,
                        "ai_role": ai_role,
                        "maximum_time": parseInt(maximum_time, 10)
                    }
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.metadata.hasOwnProperty("DivergenceIdea")) {
                    const ResponseIdea = data.metadata.DivergenceIdea;
                    SetGotIdea(ResponseIdea);
                }
                else if (data.metadata.hasOwnProperty("ConvergenceIdea")) {
                    const ResponseIdea = data.metadata.ConvergenceIdea;
                    SetGotIdea(ResponseIdea);
                }
                const ResponseMessage = data.chat.message;
                console.log(data);
                SetResponseCheck(true);
                SetAIMessage(ResponseMessage);
                console.log('Response from API:', ResponseMessage);
                addDocuments(ResponseMessage);
                // 回答を発言
                const uttr = new SpeechSynthesisUtterance(ResponseMessage);
                speechSynthesis.speak(uttr);
            } else {
                SetResponseCheck(false);
                throw new Error(`Error: ${response.status}`);
            }
        } catch (error) {
            SetResponseCheck(false);
            console.error("Failed to send transcript to API:", error);
        }
    };

    const UseFastAPITosendMinutes = async (message) => {
        try {
            const response = await fetch(`https://${currentHost}/api/minutes/111`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "text": message
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const ResponseMessage = data;
                console.log("議事録送信しました。resp==>", ResponseMessage);
            } else {
                throw new Error(`Error: ${response.status}`);
            }
        } catch (error) {
            console.error("Failed to send minutes to API:", error);
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
        if (transcript.includes("質問は以上です") && faceclicked) {
            console.log("Transcript detected:", transcript);
            Setfaceclicked(false);
            stopListening();

            // 最新の transcript を直接使用してドキュメントに追加
            addDocuments(transcript);
            UseFastAPITosendUserMessage(transcript);
            // Transcript をリセットし、再度リスニングを開始
            setTimeout(() => {
                Resetchat();
                Minutes_restartListening();
            }, 100);
        }
    }, [transcript, faceclicked]);

    useEffect(() => {
        // transcriptが変わるたびにタイマーをリセット
        if (transcript.length > 0) {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (!faceclicked) {
                // 3秒間何も発言がなければ実行
                timerRef.current = setTimeout(() => {
                    console.log("議事録を送信:", transcript);
                    setFinalTranscript(transcript); // 確定した文章を保存
                    UseFastAPITosendMinutes(finalTranscript);
                    resetTranscript(); // transcriptをリセット
                }, 2000); // 2秒
            };
        }
    }, [transcript, resetTranscript]);

    return (
        <div>
            <img src="./images/AIAgentImage.svg" style={imgstyle} onClick={FaceClick}></img>
            <ChatDrawer transcript={transcript} resetTranscript={resetTranscript} ailisteningnow={faceclicked} />
        </div>
    );
}
