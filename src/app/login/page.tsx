'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user, isAdmin } = useAuth();
  const router = useRouter();

  // Kullanıcı zaten giriş yapmışsa yönlendir
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [user, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      // Yönlendirme useEffect'te yapılacak
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Bir hata oluştu';
      
      if (errorMessage.includes('auth/invalid-credential') || errorMessage.includes('auth/wrong-password')) {
        setError('Email veya şifre hatalı');
      } else if (errorMessage.includes('auth/user-not-found')) {
        setError('Kullanıcı bulunamadı');
      } else if (errorMessage.includes('auth/invalid-email')) {
        setError('Geçersiz email adresi');
      } else if (errorMessage.includes('auth/too-many-requests')) {
        setError('Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin');
      } else {
        setError('Giriş yapılamadı. Lütfen tekrar deneyin');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative" style={{ background: '#121212' }}>
      {/* Background decorative elements - Neon glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #E94057, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #F27121, transparent)' }} />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text mb-4" 
              style={{ backgroundImage: 'linear-gradient(45deg, #E94057, #F27121)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
            İhlas Zikir
          </h1>
          <p className="text-lg" style={{ color: '#EAEAEA' }}>
            Giriş Yapın
          </p>
        </div>

        {/* Login Form */}
        <div className="backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl" 
             style={{ 
               backgroundColor: 'rgba(18, 18, 18, 0.8)', 
               border: '1px solid rgba(234, 234, 234, 0.2)',
               boxShadow: '0 0 40px rgba(233, 64, 87, 0.2)'
             }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#EAEAEA' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: 'rgba(234, 234, 234, 0.1)',
                  border: '1px solid rgba(234, 234, 234, 0.2)',
                  color: '#EAEAEA'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#E94057';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(233, 64, 87, 0.3)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(234, 234, 234, 0.2)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="ornek@email.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#EAEAEA' }}>
                Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: 'rgba(234, 234, 234, 0.1)',
                  border: '1px solid rgba(234, 234, 234, 0.2)',
                  color: '#EAEAEA'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#E94057';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(233, 64, 87, 0.3)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(234, 234, 234, 0.2)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="••••••••"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-center text-sm p-3 rounded-xl" 
                   style={{ 
                     backgroundColor: 'rgba(233, 64, 87, 0.1)',
                     border: '1px solid rgba(233, 64, 87, 0.3)',
                     color: '#E94057'
                   }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 md:py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ 
                backgroundImage: 'linear-gradient(45deg, #E94057, #F27121)',
                color: '#EAEAEA',
                boxShadow: '0 0 30px rgba(233, 64, 87, 0.4)'
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" 
                       style={{ borderColor: '#EAEAEA', borderTopColor: 'transparent' }} />
                  <span>Giriş Yapılıyor...</span>
                </div>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm" style={{ color: 'rgba(234, 234, 234, 0.6)' }}>
          <p>40.000 defa İhlas Suresi zikrini tamamlayın</p>
        </div>
      </div>
    </div>
  );
}

