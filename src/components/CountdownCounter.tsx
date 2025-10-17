// cSpell:ignore firestore
'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, updateDoc, increment } from 'firebase/firestore';

interface CountdownCounterProps {
  userId: string;
  onHover: (hovering: boolean) => void;
  onClick: () => void;
}

const INITIAL_COUNT = 40000;

export default function CountdownCounter({ userId, onHover, onClick }: CountdownCounterProps) {
  const [count, setCount] = useState<number>(INITIAL_COUNT);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // User-specific counter ID
  const counterDocId = `user-${userId}-counter`;

  // Initialize and sync with Firestore
  useEffect(() => {
    const counterRef = doc(db, 'counters', counterDocId);

    // Initialize counter if it doesn't exist
    const initializeCounter = async () => {
      try {
        const docSnap = await getDoc(counterRef);
        if (!docSnap.exists()) {
          await setDoc(counterRef, { count: INITIAL_COUNT });
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing counter:', error);
        setIsLoading(false);
      }
    };

    initializeCounter();

    // Real-time sync
    const unsubscribe = onSnapshot(counterRef, (doc) => {
      if (doc.exists()) {
        setCount(doc.data().count);
      }
    });

    return () => unsubscribe();
  }, [counterDocId]);

  const handleClick = useCallback(async () => {
    if (count > 0 && !isLoading) {
      setIsAnimating(true);
      onClick();

      // Haptic feedback on mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }

      try {
        const counterRef = doc(db, 'counters', counterDocId);
        await updateDoc(counterRef, {
          count: increment(-1)
        });

        // Check if completed
        if (count - 1 === 0) {
          setShowConfetti(true);
          // Celebration vibration
          if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100, 50, 200]);
          }
        }
      } catch (error) {
        console.error('Error updating counter:', error);
      }

      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [count, onClick, isLoading, counterDocId]);

  // Keyboard support (spacebar)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        handleClick();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleClick]);

  const progress = ((INITIAL_COUNT - count) / INITIAL_COUNT) * 100;
  const circumference = 2 * Math.PI * 140; // radius = 140
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative">
      {/* Completion confetti effect */}
      {showConfetti && count === 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: '50%',
                top: '50%',
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                animationDelay: `${Math.random() * 0.5}s`,
                '--tx': `${(Math.random() - 0.5) * 400}px`,
                '--ty': `${(Math.random() - 0.5) * 400}px`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Main counter circle */}
      <div
        className={`relative cursor-pointer select-none transition-transform duration-300 ${
          isAnimating ? 'scale-95' : 'scale-100'
        } hover:scale-105`}
        onClick={handleClick}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
      >
        {/* SVG Progress Ring */}
        <svg className="w-80 h-80 transform -rotate-90" viewBox="0 0 300 300">
          {/* Background circle */}
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke="rgba(234, 234, 234, 0.1)"
            strokeWidth="12"
          />
          {/* Progress circle with neon glow */}
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
            style={{ 
              filter: 'drop-shadow(0 0 8px rgba(233, 64, 87, 0.6)) drop-shadow(0 0 15px rgba(242, 113, 33, 0.4))'
            }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E94057" />
              <stop offset="100%" stopColor="#F27121" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {count === 0 ? (
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-3xl font-bold text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(45deg, #E94057, #F27121)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
                Tamamlandı!
              </div>
            </div>
          ) : (
            <>
              <div className="text-7xl font-bold text-transparent bg-clip-text mb-2 tabular-nums" style={{ backgroundImage: 'linear-gradient(135deg, #E94057, #F27121)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
                {count.toLocaleString('tr-TR')}
              </div>
              <div className="text-sm font-medium tracking-wider uppercase" style={{ color: '#EAEAEA' }}>
                Kalan Zikir
              </div>
              <div className="mt-3 text-xs" style={{ color: 'rgba(234, 234, 234, 0.6)' }}>
                %{progress.toFixed(1)} tamamlandı
              </div>
            </>
          )}
        </div>

        {/* Neon glow effect on hover */}
        <div 
          className="absolute inset-0 rounded-full transition-all duration-300 pointer-events-none"
          style={{
            background: isAnimating 
              ? 'radial-gradient(circle, rgba(254, 225, 64, 0.15), transparent 70%)'
              : 'transparent',
            boxShadow: isAnimating 
              ? '0 0 30px rgba(254, 225, 64, 0.4), inset 0 0 30px rgba(254, 225, 64, 0.2)'
              : 'none'
          }}
        />
      </div>
    </div>
  );
}

