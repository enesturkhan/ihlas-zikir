'use client';

import { useState, useEffect } from 'react';

interface CustomCursorProps {
  isHovering?: boolean;
  isClicking?: boolean;
}

export default function CustomCursor({ isHovering = false, isClicking = false }: CustomCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      className={`custom-cursor fixed pointer-events-none z-50 transition-all duration-150 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${isHovering ? 'scale-150' : 'scale-100'} ${isClicking ? 'scale-75' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Outer ring with neon yellow glow */}
      <div
        className="w-8 h-8 rounded-full border-2 transition-all duration-200"
        style={{
          borderColor: isHovering || isClicking ? '#FEE140' : 'rgba(254, 225, 64, 0.6)',
          backgroundColor: isHovering || isClicking ? 'rgba(254, 225, 64, 0.3)' : 'rgba(254, 225, 64, 0.1)',
          boxShadow: isHovering || isClicking 
            ? '0 0 15px rgba(254, 225, 64, 0.8), 0 0 30px rgba(254, 225, 64, 0.4)' 
            : '0 0 8px rgba(254, 225, 64, 0.4)'
        }}
      />
      {/* Inner dot - Neon Yellow */}
      <div
        className="absolute top-1/2 left-1/2 rounded-full transition-all duration-200"
        style={{ 
          transform: 'translate(-50%, -50%)',
          width: isClicking ? '8px' : '6px',
          height: isClicking ? '8px' : '6px',
          backgroundColor: '#FEE140',
          boxShadow: '0 0 10px rgba(254, 225, 64, 0.8)'
        }}
      />
    </div>
  );
}

