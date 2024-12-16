import React, { useState, useEffect } from 'react';

export const TimerValue = () => {
  const [timeLeft, setTimeLeft] = useState(60); // 初期値60秒

  useEffect(() => {
    if (timeLeft <= 0) return; // カウントダウン終了時に停止

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId); // クリーンアップ
  }, [timeLeft]);

  return (
    <div style={{ textAlign: 'center', color:'#2463EB', position:'absolute', top:520, left:160, fontSize:'100px', fontWeight:30}}>
      {timeLeft > 0 ? `${timeLeft}` : '0'}
    </div>
  );
};
