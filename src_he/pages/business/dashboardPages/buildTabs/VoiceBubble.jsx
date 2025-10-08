import React, { useRef, useState } from 'react';
import './VoiceBubble.css';

const VoiceBubble = ({ url }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div className="voice-bubble">
      <button className="voice-play-btn" onClick={togglePlay}>
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      <audio
        ref={audioRef}
        src={url}
        preload="auto"
        onEnded={() => setIsPlaying(false)}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default VoiceBubble;
