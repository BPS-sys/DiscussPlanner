import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// Notionの認証が完了しました。というページ
const NotionSuccess = () => {
    // const [searchParams] = useSearchParams();
    const [countdown, setCountdown] = React.useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    clearInterval(timer);
                    window.location.href = "http://localhost:80";
                }
                return prevCountdown - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div>
            <h1>Notionの認証が完了しました！</h1>
            <p>{countdown}秒後にリダイレクトします...</p>
            <p>
                自動遷移しない場合は、
                <a href="http://localhost:80">こちらをクリック</a>
            </p>
        </div>
    );
};

export default NotionSuccess;
