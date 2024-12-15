import React, { createContext, useState, useContext } from "react";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";

// Context の作成
const MicContext = createContext();

// Context Provider の定義
export const MicProvider = ({ children }) => {
    const [micmute, SetMute] = useState(false);

    const toggleListening = () => {
        if (micmute == true) {
            stopListening();
        }
        else {
            startListening()
        };
    }
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    const startListening = () => {
        SpeechRecognition.startListening({ continuous: true, language: "ja-JP" });
    };

    const stopListening = () => {
        SpeechRecognition.stopListening();
    };

    return (
        <MicContext.Provider value={{ micmute, SetMute, toggleListening, transcript }}>
            {children}
        </MicContext.Provider>
    );
};

// Context を利用するカスタムフック
export const useMicContext = () => {
    return useContext(MicContext);
};