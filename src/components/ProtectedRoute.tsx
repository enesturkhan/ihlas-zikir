'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Giriş yapmamış kullanıcıyı login sayfasına yönlendir
        router.push('/login');
      } else if (requireAdmin && !isAdmin) {
        // Admin olmayan kullanıcıyı ana sayfaya yönlendir
        router.push('/');
      }
    }
  }, [user, loading, isAdmin, requireAdmin, router]);

  // Loading ekranı
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#121212' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" 
               style={{ borderColor: '#E94057', borderTopColor: 'transparent' }} />
          <p className="text-lg" style={{ color: '#EAEAEA' }}>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Kullanıcı yoksa veya yetki yoksa boş döndür (yönlendirme yapılacak)
  if (!user || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}

