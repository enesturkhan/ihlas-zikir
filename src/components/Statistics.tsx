'use client';

import { useState, useEffect } from 'react';
import ShareButton from './ShareButton';

interface StatisticsProps {
  count: number;
  initialCount: number;
}

export default function Statistics({ count, initialCount }: StatisticsProps) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const completed = initialCount - count;
  const progress = (completed / initialCount) * 100;

  // Load or set start time
  useEffect(() => {
    const stored = localStorage.getItem('ihlas-zikir-start-time');
    if (stored) {
      setStartTime(parseInt(stored, 10));
    } else if (completed > 0) {
      const now = Date.now();
      localStorage.setItem('ihlas-zikir-start-time', now.toString());
      setStartTime(now);
    }
  }, [completed]);

  // Calculate statistics
  const getStatistics = () => {
    if (!startTime || completed === 0) {
      return {
        elapsedTime: 'Henüz başlamadınız',
        averagePerMinute: 0,
        estimatedCompletion: 'Hesaplanıyor...',
      };
    }

    const elapsed = Date.now() - startTime;
    const elapsedMinutes = elapsed / (1000 * 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const remainingMinutes = Math.floor(elapsedMinutes % 60);

    const avgPerMinute = completed / elapsedMinutes;
    const remainingCount = count;
    const estimatedMinutes = remainingCount / avgPerMinute;
    const estimatedHours = Math.floor(estimatedMinutes / 60);
    const estimatedRemainingMinutes = Math.floor(estimatedMinutes % 60);

    return {
      elapsedTime: `${elapsedHours}s ${remainingMinutes}dk`,
      averagePerMinute: avgPerMinute.toFixed(1),
      estimatedCompletion:
        count === 0
          ? 'Tamamlandı! 🎉'
          : `~${estimatedHours}s ${estimatedRemainingMinutes}dk`,
    };
  };

  const stats = getStatistics();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-8 md:bottom-8 md:top-auto left-8 p-3 rounded-full font-medium transition-all duration-300 backdrop-blur-sm shadow-lg hover:scale-105 active:scale-95 z-20"
        style={{
          backgroundColor: 'rgba(18, 18, 18, 0.8)',
          border: '1px solid rgba(234, 234, 234, 0.2)',
          color: '#EAEAEA'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(242, 113, 33, 0.3)';
          e.currentTarget.style.borderColor = '#F27121';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(242, 113, 33, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(18, 18, 18, 0.8)';
          e.currentTarget.style.borderColor = 'rgba(234, 234, 234, 0.2)';
          e.currentTarget.style.boxShadow = '';
        }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop - click to close */}
      <div 
        className="fixed inset-0 z-10 bg-transparent"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Panel */}
      <div className="fixed top-8 md:bottom-8 md:top-auto left-8 backdrop-blur-md rounded-2xl p-6 shadow-2xl z-20 w-72" style={{
        background: 'rgba(18, 18, 18, 0.95)',
        border: '1px solid rgba(234, 234, 234, 0.2)'
      }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold" style={{ color: '#EAEAEA' }}>İstatistikler</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="transition-colors"
          style={{ color: 'rgba(234, 234, 234, 0.6)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#EAEAEA'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(234, 234, 234, 0.6)'}
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {/* Completed */}
        <div>
          <div className="text-xs mb-1" style={{ color: 'rgba(234, 234, 234, 0.6)' }}>Tamamlanan</div>
          <div className="text-2xl font-bold text-transparent bg-clip-text" style={{ 
            backgroundImage: 'linear-gradient(45deg, #E94057, #F27121)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text'
          }}>
            {completed.toLocaleString('tr-TR')}
          </div>
        </div>

        {/* Remaining */}
        <div>
          <div className="text-xs mb-1" style={{ color: 'rgba(234, 234, 234, 0.6)' }}>Kalan</div>
          <div className="text-2xl font-bold" style={{ color: '#EAEAEA' }}>
            {count.toLocaleString('tr-TR')}
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="text-xs mb-1" style={{ color: 'rgba(234, 234, 234, 0.6)' }}>İlerleme</div>
          <div className="flex items-center gap-3">
            <div className="flex-1 rounded-full h-2 overflow-hidden" style={{ backgroundColor: 'rgba(234, 234, 234, 0.1)' }}>
              <div
                className="h-full transition-all duration-500"
                style={{ 
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #E94057, #F27121)',
                  boxShadow: '0 0 10px rgba(233, 64, 87, 0.5)'
                }}
              />
            </div>
            <span className="text-sm font-medium" style={{ color: '#EAEAEA' }}>
              {progress.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Elapsed Time */}
        <div>
          <div className="text-xs mb-1" style={{ color: 'rgba(234, 234, 234, 0.6)' }}>Geçen Süre</div>
          <div className="text-lg font-semibold" style={{ color: '#EAEAEA' }}>
            {stats.elapsedTime}
          </div>
        </div>

        {/* Average per minute */}
        {completed > 0 && (
          <div>
            <div className="text-xs mb-1" style={{ color: 'rgba(234, 234, 234, 0.6)' }}>Dakikada Ortalama</div>
            <div className="text-lg font-semibold" style={{ color: '#EAEAEA' }}>
              {stats.averagePerMinute} zikir/dk
            </div>
          </div>
        )}

        {/* Estimated completion */}
        {count > 0 && completed > 0 && (
          <div>
            <div className="text-xs mb-1" style={{ color: 'rgba(234, 234, 234, 0.6)' }}>Tahmini Kalan Süre</div>
            <div className="text-lg font-semibold" style={{ color: '#EAEAEA' }}>
              {stats.estimatedCompletion}
            </div>
          </div>
        )}

        {count === 0 && (
          <div className="text-center py-2">
            <div className="text-3xl mb-2">🎉</div>
            <div className="text-sm font-medium" style={{ color: '#FEE140' }}>
              Tebrikler! Tamamladınız!
            </div>
          </div>
        )}

        {/* Share Button */}
        {completed > 0 && (
          <div className="pt-4" style={{ borderTop: '1px solid rgba(234, 234, 234, 0.1)' }}>
            <ShareButton completed={completed} total={initialCount} />
          </div>
        )}
      </div>
    </div>
    </>
  );
}

