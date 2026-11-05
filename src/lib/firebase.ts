import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

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
export const auth = getAuth(app);

// Initialize Firebase Analytics if supported in current environment
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export interface CustomerOrderData {
  userId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  city?: string;
  pincode?: string;
}

/**
 * Asynchronously log an order to Firebase Firestore with customer details and pending status.
 */
export async function logOrder(
  items: unknown,
  totalAmount: number | string,
  customerData?: CustomerOrderData
) {
  if (!isFirebaseConfigured) {
    console.info('Firebase credentials are not set.');
    return;
  }

  try {
    const orderDoc = await addDoc(collection(db, 'orders'), {
      items,
      total_amount: totalAmount,
      status: 'PENDING',
      payment_status: 'UNPAID',
      user_id: customerData?.userId || 'guest',
      customer_name: customerData?.customerName || '',
      customer_email: customerData?.customerEmail || '',
      customer_phone: customerData?.customerPhone || '',
      delivery_address: customerData?.deliveryAddress || '',
      city: customerData?.city || '',
      pincode: customerData?.pincode || '',
      created_at: serverTimestamp(),
    });
    return orderDoc.id;
  } catch (error) {
    console.error('Firebase order log error:', error);
  }
}

/**
 * Upload an image file to Firebase Storage and get its public download URL.
 */
export async function uploadImage(file: Blob | Uint8Array | ArrayBuffer, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
}
