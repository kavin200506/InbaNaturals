import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDlwrEn-_zpJxttR7fadwyEU9nnlJgmeBA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "inbanaturals-f936d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "inbanaturals-f936d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "inbanaturals-f936d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "102101523106",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:102101523106:web:0449539a500f9efece55fb",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XW9W31ZK7B",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Firebase Analytics if supported in current environment
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

/**
 * Asynchronously log an order to Firebase Firestore without blocking user navigation.
 */
export async function logOrder(items: unknown, totalAmount: number | string) {
  if (!isFirebaseConfigured) {
    console.info('Firebase credentials are not set.');
    return;
  }

  try {
    await addDoc(collection(db, 'orders'), {
      items,
      total_amount: totalAmount,
      created_at: serverTimestamp(),
    });
  } catch (error) {
    console.error('Firebase order log error:', error);
  }
}

/**
 * Upload an image file to Firebase Storage and get its public download URL.
 * @param file The image file (Blob or File)
 * @param path Storage destination path (e.g. 'products/hair-oil.jpg')
 */
export async function uploadImage(file: Blob | Uint8Array | ArrayBuffer, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
}
