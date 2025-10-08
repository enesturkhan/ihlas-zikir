// Firebase yapılandırması ve başlatma
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase yapılandırma bilgileri
// Bu bilgileri Firebase Console'dan alabilirsiniz
const firebaseConfig = {
    apiKey: "AIzaSyCBWpWwYpqin5by3fiyp5k8QnYFd3GmL_M",
    authDomain: "ihlas-zikir.firebaseapp.com",
    projectId: "ihlas-zikir",
    storageBucket: "ihlas-zikir.firebasestorage.app",
    messagingSenderId: "1083295983369",
    appId: "1:1083295983369:web:60e7056f2e68c28f5695d8"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Authentication servisi
export const auth = getAuth(app);

// Firestore database servisi
export const db = getFirestore(app);

// Analytics (opsiyonel) - sadece client-side'da
export const analytics = typeof window !== 'undefined' && firebaseConfig.measurementId 
  ? getAnalytics(app) 
  : null;

export default app;

