'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LogoutButton() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="fixed top-4 left-4 px-4 py-2 md:px-6 md:py-3 rounded-full font-medium transition-all duration-300 backdrop-blur-sm shadow-lg hover:scale-105 active:scale-95 z-20"
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
          className="w-4 h-4 md:w-5 md:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span className="hidden sm:inline">Çıkış Yap</span>
      </div>
    </button>
  );
}

