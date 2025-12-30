import React from 'react';

interface RGBTextProps {
  text: string;
  className?: string;
}

export const RGBText: React.FC<RGBTextProps> = ({ text, className = '' }) => {
  return (
    <h1 
      className={`font-gaming font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-500 to-yellow-400 animate-rgb-flow bg-[length:200%_auto] drop-shadow-[0_0_10px_rgba(139,92,246,0.6)] ${className}`}
    >
      {text}
    </h1>
  );
};