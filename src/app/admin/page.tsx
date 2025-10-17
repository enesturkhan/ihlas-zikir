'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, secondaryAuth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import LogoutButton from '@/components/LogoutButton';
import ProtectedRoute from '@/components/ProtectedRoute';

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export default function AdminPage() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [addingUser, setAddingUser] = useState(false);
  
  // Form states
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modalError, setModalError] = useState('');
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);

  // Kullanıcıları yükle (sadece aktif olanlar)
  const loadUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs
        .map(doc => ({
          uid: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }))
        .filter(user => !user.deleted) as UserData[];  // Sadece aktif kullanıcılar
      setUsers(usersData);
      setLoading(false);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Kullanıcılar yüklenirken hata oluştu');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Email kontrolü (real-time) - Soft delete desteği ile
  const checkEmailAvailability = async (email: string) => {
    if (!email || !email.includes('@')) {
      setModalError('');
      return;
    }

    setEmailCheckLoading(true);
    try {
      // 1. Firestore'da silinen kullanıcı var mı kontrol et
      const { query, where, getDocs } = await import('firebase/firestore');
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        if (userData.deleted) {
          // Silinen kullanıcı - tekrar aktif edilebilir
          setModalError('');
          return;
        }
      }
      
      // 2. Firebase Auth'da email var mı kontrol et
      const { fetchSignInMethodsForEmail } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');
      const methods = await fetchSignInMethodsForEmail(auth, email);
      
      if (methods.length > 0 && snapshot.empty) {
        // Auth'da var ama Firestore'da yok (zombie kullanıcı)
        setModalError('Bu email Authentication\'da kayıtlı. Lütfen farklı email kullanın.');
      } else if (!snapshot.empty && !snapshot.docs[0].data().deleted) {
        // Aktif kullanıcı var
        setModalError('Bu email zaten kullanımda');
      } else {
        setModalError('');
      }
    } catch (err) {
      setModalError('');
    } finally {
      setEmailCheckLoading(false);
    }
  };

  // Yeni kullanıcı ekle (Soft delete desteği ile)
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setModalError('');
    setAddingUser(true);

    if (!currentAdmin) {
      setModalError('Admin bilgisi bulunamadı');
      setAddingUser(false);
      return;
    }

    try {
      // 1. Silinen kullanıcı var mı kontrol et
      const { query, where, getDocs } = await import('firebase/firestore');
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', newEmail));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty && snapshot.docs[0].data().deleted) {
        // Silinen kullanıcı tekrar aktif ediliyor
        const userId = snapshot.docs[0].id;
        
        // Firestore'da güncelle (deleted: false)
        await updateDoc(doc(db, 'users', userId), {
          displayName: newDisplayName,
          deleted: false,
          updatedAt: new Date(),
        });

        // Counter'ı sıfırla
        await setDoc(doc(db, 'counters', `user-${userId}-counter`), {
          count: 40000,
          lastUpdated: new Date(),
        });

        setSuccess('Kullanıcı tekrar aktif edildi!');
        setNewEmail('');
        setNewPassword('');
        setNewDisplayName('');
        setModalError('');
        setShowAddModal(false);
        await loadUsers();
        return;
      }

      // 2. Yeni kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        newEmail,
        newPassword
      );
      
      const newUserId = userCredential.user.uid;

      // 3. Secondary auth'dan çıkış yap
      await secondaryAuth.signOut();

      // 4. Firestore'a kullanıcı bilgilerini kaydet
      await setDoc(doc(db, 'users', newUserId), {
        email: newEmail,
        displayName: newDisplayName,
        role: 'user',
        deleted: false,
        createdAt: new Date(),
      });

      // 5. Counter oluştur
      await setDoc(doc(db, 'counters', `user-${newUserId}-counter`), {
        count: 40000,
        lastUpdated: new Date(),
      });

      setSuccess('Kullanıcı başarıyla eklendi!');
      setNewEmail('');
      setNewPassword('');
      setNewDisplayName('');
      setModalError('');
      setShowAddModal(false);
      await loadUsers();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Bir hata oluştu';
      
      if (errorMessage.includes('auth/email-already-in-use')) {
        setModalError('Bu email Authentication\'da kayıtlı ama Firestore\'da yok. Lütfen farklı email kullanın.');
      } else if (errorMessage.includes('auth/weak-password')) {
        setModalError('Şifre çok zayıf (minimum 6 karakter)');
      } else {
        setModalError(errorMessage);
      }
    } finally {
      setAddingUser(false);
    }
  };

  // Kullanıcı güncelle
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setError('');
    setSuccess('');

    try {
      await updateDoc(doc(db, 'users', editingUser.uid), {
        displayName: editingUser.displayName,
      });

      setSuccess('Kullanıcı güncellendi!');
      setEditingUser(null);
      loadUsers();
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Kullanıcı güncellenirken hata oluştu');
    }
  };

  // Kullanıcı sil (Soft delete)
  const handleDeleteUser = async (userId: string) => {
    setError('');
    setSuccess('');

    try {
      // Soft delete: deleted: true olarak işaretle (hard delete yapma)
      await updateDoc(doc(db, 'users', userId), {
        deleted: true,
        deletedAt: new Date(),
      });

      setSuccess('Kullanıcı silindi! (Aynı email ile tekrar eklenebilir)');
      setDeleteConfirm(null);
      loadUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Kullanıcı silinirken hata oluştu');
    }
  };

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

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen p-4 md:p-8 overflow-hidden relative" style={{ background: '#121212' }}>
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #E94057, transparent)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #F27121, transparent)' }} />
        </div>

        {/* Logout Button */}
        <LogoutButton />

        {/* Welcome Message */}
        {currentAdmin && (
          <div className="fixed top-4 right-4 md:right-20 z-20 px-4 py-2 md:px-6 md:py-3 rounded-full backdrop-blur-sm shadow-lg"
               style={{ 
                 backgroundColor: 'rgba(18, 18, 18, 0.8)', 
                 border: '1px solid rgba(234, 234, 234, 0.2)',
               }}>
            <p className="text-sm md:text-base font-medium text-transparent bg-clip-text" 
               style={{ backgroundImage: 'linear-gradient(45deg, #E94057, #F27121)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
              Hoşgeldin, <span className="font-bold">{currentAdmin.displayName}</span>
            </p>
          </div>
        )}

        {/* Header */}
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-8 mt-16 md:mt-0">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text mb-4" 
                style={{ backgroundImage: 'linear-gradient(45deg, #E94057, #F27121)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
              Admin Paneli
            </h1>
            <p className="text-lg" style={{ color: '#EAEAEA' }}>
              Kullanıcı Yönetimi
            </p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 text-center p-4 rounded-xl backdrop-blur-sm" 
                 style={{ 
                   backgroundColor: 'rgba(34, 197, 94, 0.1)',
                   border: '1px solid rgba(34, 197, 94, 0.3)',
                   color: '#22c55e'
                 }}>
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 text-center p-4 rounded-xl backdrop-blur-sm" 
                 style={{ 
                   backgroundColor: 'rgba(233, 64, 87, 0.1)',
                   border: '1px solid rgba(233, 64, 87, 0.3)',
                   color: '#E94057'
                 }}>
              {error}
            </div>
          )}

          {/* Add User Button */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => {
                setShowAddModal(true);
                setModalError('');
                setNewEmail('');
                setNewPassword('');
                setNewDisplayName('');
              }}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ 
                backgroundImage: 'linear-gradient(45deg, #E94057, #F27121)',
                color: '#EAEAEA',
                boxShadow: '0 0 30px rgba(233, 64, 87, 0.4)'
              }}
            >
              + Yeni Kullanıcı Ekle
            </button>
          </div>

          {/* Users List - Desktop: Table, Mobile: Cards */}
          
          {/* Desktop Table View - Hidden on Mobile */}
          <div className="hidden md:block backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl" 
               style={{ 
                 backgroundColor: 'rgba(18, 18, 18, 0.8)', 
                 border: '1px solid rgba(234, 234, 234, 0.2)',
               }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(234, 234, 234, 0.2)' }}>
                    <th className="px-4 py-4 text-left text-sm font-semibold" style={{ color: '#EAEAEA' }}>Ad Soyad</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold" style={{ color: '#EAEAEA' }}>Email</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold" style={{ color: '#EAEAEA' }}>Rol</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold" style={{ color: '#EAEAEA' }}>Kayıt Tarihi</th>
                    <th className="px-4 py-4 text-right text-sm font-semibold" style={{ color: '#EAEAEA' }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.uid} style={{ borderBottom: '1px solid rgba(234, 234, 234, 0.1)' }}>
                      <td className="px-4 py-4 text-sm" style={{ color: '#EAEAEA' }}>{user.displayName}</td>
                      <td className="px-4 py-4 text-sm" style={{ color: 'rgba(234, 234, 234, 0.7)' }}>{user.email}</td>
                      <td className="px-4 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: user.role === 'admin' ? 'rgba(233, 64, 87, 0.2)' : 'rgba(234, 234, 234, 0.1)',
                                color: user.role === 'admin' ? '#E94057' : '#EAEAEA'
                              }}>
                          {user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm" style={{ color: 'rgba(234, 234, 234, 0.7)' }}>
                        {user.createdAt.toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="px-3 py-1 rounded-lg text-sm transition-all duration-300 hover:scale-105"
                            style={{ 
                              backgroundColor: 'rgba(242, 113, 33, 0.2)',
                              color: '#F27121',
                              border: '1px solid rgba(242, 113, 33, 0.3)'
                            }}
                          >
                            Düzenle
                          </button>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => setDeleteConfirm(user.uid)}
                              className="px-3 py-1 rounded-lg text-sm transition-all duration-300 hover:scale-105"
                              style={{ 
                                backgroundColor: 'rgba(233, 64, 87, 0.2)',
                                color: '#E94057',
                                border: '1px solid rgba(233, 64, 87, 0.3)'
                              }}
                            >
                              Sil
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View - Hidden on Desktop */}
          <div className="md:hidden space-y-4">
            {users.map((user) => (
              <div key={user.uid} className="backdrop-blur-sm rounded-2xl p-4 shadow-lg"
                   style={{ 
                     backgroundColor: 'rgba(18, 18, 18, 0.8)', 
                     border: '1px solid rgba(234, 234, 234, 0.2)',
                   }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-base mb-1" style={{ color: '#EAEAEA' }}>
                      {user.displayName}
                    </h4>
                    <p className="text-sm mb-2" style={{ color: 'rgba(234, 234, 234, 0.7)' }}>
                      {user.email}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: user.role === 'admin' ? 'rgba(233, 64, 87, 0.2)' : 'rgba(234, 234, 234, 0.1)',
                          color: user.role === 'admin' ? '#E94057' : '#EAEAEA'
                        }}>
                    {user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                  </span>
                </div>
                
                <div className="text-xs mb-3" style={{ color: 'rgba(234, 234, 234, 0.5)' }}>
                  {user.createdAt.toLocaleDateString('tr-TR')}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 active:scale-95"
                    style={{ 
                      backgroundColor: 'rgba(242, 113, 33, 0.2)',
                      color: '#F27121',
                      border: '1px solid rgba(242, 113, 33, 0.3)'
                    }}
                  >
                    Düzenle
                  </button>
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => setDeleteConfirm(user.uid)}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 active:scale-95"
                      style={{ 
                        backgroundColor: 'rgba(233, 64, 87, 0.2)',
                        color: '#E94057',
                        border: '1px solid rgba(233, 64, 87, 0.3)'
                      }}
                    >
                      Sil
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowAddModal(false)}>
            <div className="backdrop-blur-sm rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl" 
                 style={{ 
                   backgroundColor: 'rgba(18, 18, 18, 0.95)', 
                   border: '1px solid rgba(234, 234, 234, 0.2)',
                 }}
                 onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text" 
                  style={{ backgroundImage: 'linear-gradient(45deg, #E94057, #F27121)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
                Yeni Kullanıcı Ekle
              </h2>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#EAEAEA' }}>Ad Soyad</label>
                  <input
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    required
                    disabled={addingUser}
                    className="w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: 'rgba(234, 234, 234, 0.1)',
                      border: '1px solid rgba(234, 234, 234, 0.2)',
                      color: '#EAEAEA'
                    }}
                    placeholder="Örn: Ahmet Yılmaz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#EAEAEA' }}>Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => {
                        setNewEmail(e.target.value);
                        // Debounce için setTimeout kullan
                        setTimeout(() => {
                          if (e.target.value) {
                            checkEmailAvailability(e.target.value);
                          }
                        }, 500);
                      }}
                      onBlur={() => newEmail && checkEmailAvailability(newEmail)}
                      required
                      disabled={addingUser}
                      className="w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ 
                        backgroundColor: 'rgba(234, 234, 234, 0.1)',
                        border: modalError ? '1px solid #E94057' : '1px solid rgba(234, 234, 234, 0.2)',
                        color: '#EAEAEA'
                      }}
                      placeholder="ornek@email.com"
                    />
                    {emailCheckLoading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" 
                             style={{ borderColor: '#E94057', borderTopColor: 'transparent' }} />
                      </div>
                    )}
                  </div>
                  {modalError && !emailCheckLoading && (
                    <p className="text-xs mt-1" style={{ color: '#E94057' }}>
                      {modalError}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#EAEAEA' }}>Şifre</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={addingUser}
                    className="w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: 'rgba(234, 234, 234, 0.1)',
                      border: '1px solid rgba(234, 234, 234, 0.2)',
                      color: '#EAEAEA'
                    }}
                    placeholder="Minimum 6 karakter"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    disabled={addingUser}
                    className="flex-1 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: 'rgba(234, 234, 234, 0.1)',
                      border: '1px solid rgba(234, 234, 234, 0.2)',
                      color: '#EAEAEA'
                    }}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={addingUser || !!modalError || emailCheckLoading}
                    className="flex-1 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundImage: 'linear-gradient(45deg, #E94057, #F27121)',
                      color: '#EAEAEA',
                    }}
                  >
                    {addingUser ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" 
                             style={{ borderColor: '#EAEAEA', borderTopColor: 'transparent' }} />
                        <span>Ekleniyor...</span>
                      </div>
                    ) : (
                      'Ekle'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setEditingUser(null)}>
            <div className="backdrop-blur-sm rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl" 
                 style={{ 
                   backgroundColor: 'rgba(18, 18, 18, 0.95)', 
                   border: '1px solid rgba(234, 234, 234, 0.2)',
                 }}
                 onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text" 
                  style={{ backgroundImage: 'linear-gradient(45deg, #E94057, #F27121)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
                Kullanıcı Düzenle
              </h2>
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#EAEAEA' }}>Ad Soyad</label>
                  <input
                    type="text"
                    value={editingUser.displayName}
                    onChange={(e) => setEditingUser({...editingUser, displayName: e.target.value})}
                    required
                    className="w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none"
                    style={{ 
                      backgroundColor: 'rgba(234, 234, 234, 0.1)',
                      border: '1px solid rgba(234, 234, 234, 0.2)',
                      color: '#EAEAEA'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(234, 234, 234, 0.5)' }}>Email (değiştirilemez)</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl"
                    style={{ 
                      backgroundColor: 'rgba(234, 234, 234, 0.05)',
                      border: '1px solid rgba(234, 234, 234, 0.1)',
                      color: 'rgba(234, 234, 234, 0.5)',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                    style={{ 
                      backgroundColor: 'rgba(234, 234, 234, 0.1)',
                      border: '1px solid rgba(234, 234, 234, 0.2)',
                      color: '#EAEAEA'
                    }}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                    style={{ 
                      backgroundImage: 'linear-gradient(45deg, #E94057, #F27121)',
                      color: '#EAEAEA',
                    }}
                  >
                    Güncelle
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setDeleteConfirm(null)}>
            <div className="backdrop-blur-sm rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl" 
                 style={{ 
                   backgroundColor: 'rgba(18, 18, 18, 0.95)', 
                   border: '1px solid rgba(233, 64, 87, 0.3)',
                 }}
                 onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#E94057' }}>
                Kullanıcıyı Sil
              </h2>
              <p className="mb-4" style={{ color: '#EAEAEA' }}>
                Bu kullanıcıyı silmek istediğinizden emin misiniz?
              </p>
              <p className="mb-6 text-sm" style={{ color: 'rgba(234, 234, 234, 0.6)' }}>
                Not: Kullanıcı pasif hale getirilecek. Aynı email ile tekrar kullanıcı eklenebilir ve eski hesap otomatik aktif edilir.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                  style={{ 
                    backgroundColor: 'rgba(234, 234, 234, 0.1)',
                    border: '1px solid rgba(234, 234, 234, 0.2)',
                    color: '#EAEAEA'
                  }}
                >
                  İptal
                </button>
                <button
                  onClick={() => handleDeleteUser(deleteConfirm)}
                  className="flex-1 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                  style={{ 
                    backgroundColor: '#E94057',
                    color: '#EAEAEA',
                  }}
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

