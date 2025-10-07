'use client';

import { useState } from 'react';
import CountdownCounter from '@/components/CountdownCounter';
import ResetModal from '@/components/ResetModal';
import Statistics from '@/components/Statistics';

const INITIAL_COUNT = 40000;
const STORAGE_KEY = 'ihlas-zikir-count';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReset = () => {
    localStorage.setItem(STORAGE_KEY, INITIAL_COUNT.toString());
    setIsModalOpen(false);
    window.location.reload();
  };

  const getCurrentCount = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const count = parseInt(stored, 10);
        if (!isNaN(count)) {
          return count;
        }
      }
    }
    return INITIAL_COUNT;
  };

  const progress = INITIAL_COUNT - getCurrentCount();

  return (
    <>
      {/* Main Container */}
      <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative" style={{ background: '#121212' }}>
        {/* Background decorative elements - Neon glow effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #E94057, transparent)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #F27121, transparent)' }} />
        </div>

        {/* Header */}
        <div className="text-center mb-12 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text mb-4" style={{ backgroundImage: 'linear-gradient(45deg, #E94057, #F27121)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
            İhlas Zikir
          </h1>
          <p className="text-lg md:text-xl" style={{ color: '#EAEAEA' }}>
            40.000 defa &ldquo;İhlas Suresi&rdquo; zikrini tamamlayın
          </p>
        </div>

        {/* Counter */}
        <div className="relative z-10">
          <CountdownCounter 
            onHover={() => {}} 
            onClick={() => {}}
          />
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center text-sm md:text-base max-w-md relative z-10" style={{ color: '#EAEAEA' }}>
          <p className="mb-2">
            <span className="hidden md:inline">Tıklayın veya boşluk tuşuna basın</span>
            <span className="md:hidden">Dokunun</span>
          </p>
          <p className="text-xs opacity-70">
            İlerlemeniz otomatik olarak kaydedilir
          </p>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed top-8 md:bottom-8 md:top-auto right-8 px-6 py-3 rounded-full font-medium transition-all duration-300 backdrop-blur-sm shadow-lg hover:scale-105 active:scale-95 z-20"
          style={{ 
            backgroundColor: 'rgba(18, 18, 18, 0.8)', 
            border: '1px solid rgba(234, 234, 234, 0.2)',
            color: '#EAEAEA'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(233, 64, 87, 0.3)';
            e.currentTarget.style.borderColor = '#E94057';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(233, 64, 87, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(18, 18, 18, 0.8)';
            e.currentTarget.style.borderColor = 'rgba(234, 234, 234, 0.2)';
            e.currentTarget.style.boxShadow = '';
          }}
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="hidden sm:inline">Sıfırla</span>
          </div>
        </button>

        {/* Reset Modal */}
        <ResetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleReset}
          progress={progress}
        />

        {/* Statistics Panel */}
        <Statistics count={getCurrentCount()} initialCount={INITIAL_COUNT} />
      </div>
    </>
  );
}
