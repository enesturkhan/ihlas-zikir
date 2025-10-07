'use client';

import { useEffect } from 'react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  progress: number;
}

export default function ResetModal({ isOpen, onClose, onConfirm, progress }: ResetModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in" style={{ 
        background: 'linear-gradient(135deg, rgba(18, 18, 18, 0.98), rgba(30, 30, 30, 0.98))',
        border: '1px solid rgba(234, 234, 234, 0.2)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 mb-6 rounded-full flex items-center justify-center" style={{
            backgroundColor: 'rgba(233, 64, 87, 0.2)',
            boxShadow: '0 0 20px rgba(233, 64, 87, 0.3)'
          }}>
            <svg
              className="w-8 h-8"
              style={{ color: '#E94057' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#EAEAEA' }}>
            Emin misiniz?
          </h2>

          {/* Progress Info */}
          <div className="mb-6">
            <p className="mb-2" style={{ color: '#EAEAEA' }}>
              Şu ana kadar <span className="font-bold" style={{ color: '#FEE140' }}>{progress}</span> zikir çekdiniz.
            </p>
            <p className="text-sm" style={{ color: 'rgba(234, 234, 234, 0.7)' }}>
              Bu işlem geri alınamaz ve sayaç sıfırlanacak.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: 'rgba(234, 234, 234, 0.1)',
                border: '1px solid rgba(234, 234, 234, 0.2)',
                color: '#EAEAEA'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(234, 234, 234, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(234, 234, 234, 0.1)';
              }}
            >
              İptal
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(45deg, #E94057, #F27121)',
                color: '#FFFFFF',
                boxShadow: '0 0 20px rgba(233, 64, 87, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(233, 64, 87, 0.6), 0 0 40px rgba(242, 113, 33, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(233, 64, 87, 0.4)';
              }}
            >
              Sıfırla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

