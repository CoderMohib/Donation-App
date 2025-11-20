import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth, initializeAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
// @ts-ignore - getReactNativePersistence is available in newer SDKs but might be missing from types
import { getReactNativePersistence } from 'firebase/auth';

// Your Firebase configuration
// Replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'your-api-key',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'your-auth-domain',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'your-storage-bucket',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'your-sender-id',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'your-app-id',
};

// Check if Firebase config is properly set
const isFirebaseConfigValid = (): boolean => {
  return !(
    firebaseConfig.apiKey === 'your-api-key' ||
    firebaseConfig.authDomain === 'your-auth-domain' ||
    firebaseConfig.projectId === 'your-project-id' ||
    firebaseConfig.storageBucket === 'your-storage-bucket' ||
    firebaseConfig.messagingSenderId === 'your-sender-id' ||
    firebaseConfig.appId === 'your-app-id'
  );
};

// Initialize Firebase with error handling
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let isInitialized = false;
let initializationError: Error | null = null;

try {
  if (isFirebaseConfigValid()) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

    // Initialize Firebase Auth with AsyncStorage persistence
    try {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch (error) {
      console.warn('Firebase Auth already initialized, using existing instance');
      auth = getAuth(app);
    }

    // Initialize Firestore
    db = getFirestore(app);

    // Initialize Storage (optional – app works without it)
    try {
      storage = getStorage(app);
    } catch (error) {
      console.warn(
        'Firebase Storage initialization failed. Storage features will be unavailable.',
        error
      );
      storage = null;
    }

    isInitialized = true;
  } else {
    console.warn(
      'Firebase configuration not set. Using placeholder values. Please configure Firebase in .env file.'
    );
    initializationError = new Error('Firebase configuration not set');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  initializationError =
    error instanceof Error ? error : new Error('Unknown Firebase initialization error');
  // App should still work even if Firebase fails
}

// Helper to ensure Firebase is ready before use
const ensureFirebaseReady = (): void => {
  if (!isInitialized || !auth || !db) {
    throw new Error(
      'Firebase is not initialized. Please configure Firebase credentials in your .env file. ' +
        'See SETUP.md for instructions.'
    );
  }
};

// Exports used by the rest of the app
export { auth, db, storage };
export const getFirebaseApp = (): FirebaseApp | null => app;
export const isFirebaseReady = (): boolean =>
  isInitialized && app !== null && auth !== null && db !== null;
export const isStorageReady = (): boolean => storage !== null;
export const getFirebaseError = (): Error | null => initializationError;
export { ensureFirebaseReady };

export default app;
