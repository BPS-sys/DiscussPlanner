import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const NotionCallbackHandler = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // クエリパラメータからcodeを取得
    const code = searchParams.get("code");
    if (code) {
      // 任意のAPIにPOSTリクエストを送信
			let userId = `111`; // 会議ID(test)
            let projectId = `111`; // 会議ID(test)
      fetch(`http://localhost:8080/auth/notion/${userId}/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code : code }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("API request failed");
          }
          return response.json();
        })
        .then((data) => {
          console.log("API response:", data);
        })
        .catch((error) => {
          console.error("Error sending code to API:", error);
        });
    }
  }, [searchParams]);

  return <div>Processing your request...</div>;
};

export default NotionCallbackHandler;
