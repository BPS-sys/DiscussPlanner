import React, { useEffect, useRef, useState } from 'react';
import './fade_in.css';

export const DetailDescriptionDPRecordImage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 画像が画面内に入った時に発火
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.6, // 画像が60%表示された時に発火
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    // コンポーネントがアンマウントされた時にオブザーバーを解除
    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  const imgStyle = {
    width: '35vw',
  };

  return (
    <div>
      <img
        ref={imageRef}
        src="./images/DescriptionRecordImage.svg"
        style={imgStyle}
        className={`slide-in ${isVisible ? 'visible' : ''}`}
        alt="Description Record"
      />
    </div>
  );
};
