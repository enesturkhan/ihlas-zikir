'use client';

import { useState } from 'react';

interface ShareButtonProps {
  completed: number;
  total: number;
}

export default function ShareButton({ completed, total }: ShareButtonProps) {
  const [showCopied, setShowCopied] = useState(false);

  const handleShare = async () => {
    const progress = ((completed / total) * 100).toFixed(1);
    const text = `🕌 İhlas Zikir İlerlemem\n\n✅ Tamamlanan: ${completed.toLocaleString('tr-TR')} / ${total.toLocaleString('tr-TR')}\n📊 İlerleme: %${progress}\n\n"Lâ ilahe illallah" zikrini tamamlama yolculuğumda devam ediyorum! 🤲\n\n#İhlasZikir #Zikir #Tesbih`;

    // Try native share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'İhlas Zikir İlerlemem',
          text: text,
        });
      } catch (err) {
        console.log('Share cancelled or failed', err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(text);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
        style={{
          background: 'linear-gradient(45deg, #E94057, #F27121)',
          color: '#FFFFFF',
          boxShadow: '0 0 15px rgba(233, 64, 87, 0.4)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 0 25px rgba(233, 64, 87, 0.6), 0 0 35px rgba(242, 113, 33, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 0 15px rgba(233, 64, 87, 0.4)';
        }}
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
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        <span>Paylaş</span>
      </button>

      {/* Copied notification */}
      {showCopied && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-sm font-medium shadow-lg animate-scale-in whitespace-nowrap" style={{
          background: 'linear-gradient(45deg, #E94057, #F27121)',
          color: '#FFFFFF',
          boxShadow: '0 0 20px rgba(233, 64, 87, 0.5)'
        }}>
          Panoya kopyalandı! 📋
        </div>
      )}
    </div>
  );
}

