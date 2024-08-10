'use client';

import React, { useState, useEffect, useRef } from "react";
import NET from "vanta/dist/vanta.net.min";
import * as THREE from "three";
import Chatbot from './chatbot'; 
import './page.scss';

const HeroSection = () => {
  const [vantaEffect, setVantaEffect] = useState(0);
  const [showChatbot, setShowChatbot] = useState(false);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 600.0,
          minWidth: 600.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x720022,
          backgroundColor: 0x000000,
          backgroundAlpha: 0.2,
          points: 10.0,
          maxDistance: 20.0,
          spacing: 15.0,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const handleButtonClick = () => {
    setShowChatbot(true);
  };

  return (
    <>
      <div ref={vantaRef} style={{ height: '100vh', width: '100vw', position: 'absolute', zIndex: -10 }}>
      </div>
      <div className="hero-section">
        <h1>Quanta</h1>
        <p>Your Personal Chat Bot</p>
        <button onClick={handleButtonClick}>Let's Go &rarr;</button>
      </div>
      {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
    </>
  );
};

export default HeroSection;
