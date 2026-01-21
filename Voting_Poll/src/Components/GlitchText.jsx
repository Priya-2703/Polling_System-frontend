import React from 'react';
import './GlitchText.css'; 

const GlitchText = ({ text, className = "" }) => {
  return (
    <div className={`glitch-wrapper ${className}`}>
      <span 
        className="glitch-text" 
        data-text={text} // இது தான் ரொம்ப முக்கியம்!
      >
        {text}
      </span>
    </div>
  );
};

export default GlitchText;