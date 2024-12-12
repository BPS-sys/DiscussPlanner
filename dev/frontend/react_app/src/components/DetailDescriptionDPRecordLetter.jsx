import React, { useEffect, useRef, useState } from 'react';
import './fade_in.css';

export const DetailDescriptionDPRecordLetter = () => {
  const [isH1Visible, setIsH1Visible] = useState(false);
  const [isPVisible, setIsPVisible] = useState(false);

  const h1Ref = useRef(null);
  const pRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // h1が画面内に入った時に発火
        if (entries[0].isIntersecting) {
          setIsH1Visible(true);
        }
      },
      {
        threshold: 0.6, // h1が80%表示された時に発火
      }
    );

    const pObserver = new IntersectionObserver(
      (entries) => {
        // pが画面内に入った時に発火
        if (entries[0].isIntersecting) {
          setIsPVisible(true);
        }
      },
      {
        threshold: 0.6, // pが80%表示された時に発火
      }
    );

    if (h1Ref.current) {
      observer.observe(h1Ref.current);
    }

    if (pRef.current) {
      pObserver.observe(pRef.current);
    }

    // コンポーネントがアンマウントされた時にオブザーバーを解除
    return () => {
      if (h1Ref.current) {
        observer.unobserve(h1Ref.current);
      }
      if (pRef.current) {
        pObserver.unobserve(pRef.current);
      }
    };
  }, []);

  const divstyle = {
    width: '38vw',
    paddingTop: '4vw',
    paddingLeft: '12vw',
  };

  const h1style = {
    fontSize: '3vw',
    fontWeight: 600,
    color: '#4294FF',
    textAlign: 'left',
  };

  const pstyle = {
    fontSize: '1.6vw',
    fontWeight: 600,
    color: '#8E8E8E',
    textAlign: 'left',
  };

  return (
    <div style={divstyle}>
      <h1
        ref={h1Ref}
        style={h1style}
        className={`slide-in ${isH1Visible ? 'visible' : ''}`}
      >
        1. 議事録の作成
      </h1>
      <p
        ref={pRef}
        style={pstyle}
        className={`slide-in ${isPVisible ? 'visible' : ''}`}
      >
        ここで機能の説明を記載します。<br />
        AIが会議中の会話から議事録を自動生成します。<br />
        後から確認・編集することも可能です。
      </p>
    </div>
  );
};
