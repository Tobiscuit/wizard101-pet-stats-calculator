import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { safeJsonParse } from "@/lib/safe-json";

const firebaseConfig = safeJsonParse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);

export function getFirebaseApp() {
  if (getApps().length === 0) {
    if (!firebaseConfig || Object.keys(firebaseConfig).length === 0) {
        if (process.env.NODE_ENV !== 'production') {
             console.warn("NEXT_PUBLIC_FIREBASE_CONFIG not found or invalid. Using mock for build/dev.");
             console.log("Raw Config:", process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
        }
        return initializeApp({
            apiKey: "mock-api-key",
            authDomain: "mock-project.firebaseapp.com",
            projectId: "mock-project",
            storageBucket: "mock-project.appspot.com",
            messagingSenderId: "1234567890",
            appId: "1:1234567890:web:123456"
        });
    }
    console.log("Initializing Firebase with Project:", (firebaseConfig as any).projectId);
    return initializeApp(firebaseConfig);
  }
  return getApp();
}

import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

// ... (existing imports)

// Initialize Firestore with settings for better offline support
export const db = initializeFirestore(getFirebaseApp(), {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
    }),
    experimentalForceLongPolling: true, // Forces long polling to avoid WebSocket issues
});
export const auth = getAuth(getFirebaseApp());
