// cSpell:ignore firestore
// Firebase yapılandırması ve başlatma
import { initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { Analytics } from 'firebase/analytics';

// Firebase yapılandırma bilgileri
const firebaseConfig = {
    apiKey: "AIzaSyCBWpWwYpqin5by3fiyp5k8QnYFd3GmL_M",
    authDomain: "ihlas-zikir.firebaseapp.com",
    projectId: "ihlas-zikir",
    storageBucket: "ihlas-zikir.firebasestorage.app",
    messagingSenderId: "1083295983369",
    appId: "1:1083295983369:web:60e7056f2e68c28f5695d8"
};

// Firebase'i başlat (Primary App - normal kullanım için)
let app: FirebaseApp;
try {
  app = getApp();
} catch {
  app = initializeApp(firebaseConfig);
}

// Secondary App (Admin kullanıcı oluşturmak için - mevcut oturumu etkilemez)
let secondaryApp: FirebaseApp;
try {
  secondaryApp = getApp('secondary');
} catch {
  secondaryApp = initializeApp(firebaseConfig, 'secondary');
}

// Authentication servisi (Primary)
export const auth: Auth = getAuth(app);

// Authentication servisi (Secondary - kullanıcı oluşturmak için)
export const secondaryAuth: Auth = getAuth(secondaryApp);

// Firestore database servisi
export const db: Firestore = getFirestore(app);

// Analytics (opsiyonel) - sadece client-side'da
export const analytics: Analytics | null = null;

export default app;

