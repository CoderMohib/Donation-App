import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from '../types';
import { auth, db, ensureFirebaseReady } from './firebase';

/**
 * Sign up a new user with email and password
 */
export const signUp = async (
    email: string,
    password: string,
    name: string
): Promise<User> => {
    ensureFirebaseReady();
    if (!auth || !db) throw new Error('Firebase is not initialized');
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Update display name
    await updateProfile(firebaseUser, { displayName: name });

    // Create user document in Firestore
    const userData: User = {
        id: firebaseUser.uid,
        name,
        email: firebaseUser.email!,
        role: 'user',
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), userData);

    return userData;
};

/**
 * Sign in an existing user
 */
export const signIn = async (
    email: string,
    password: string
): Promise<User> => {
    ensureFirebaseReady();
    if (!auth || !db) throw new Error('Firebase is not initialized');
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (!userDoc.exists()) {
        throw new Error('User data not found');
    }

    return userDoc.data() as User;
};

/**
 * Sign out the current user
 */
export const logOut = async (): Promise<void> => {
    ensureFirebaseReady();
    if (!auth) throw new Error('Firebase is not initialized');
    await signOut(auth);
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
    ensureFirebaseReady();
    if (!auth) throw new Error('Firebase is not initialized');
    await sendPasswordResetEmail(auth, email);
};

/**
 * Get current user data from Firestore
 */
export const getCurrentUser = async (): Promise<User | null> => {
    ensureFirebaseReady();
    if (!auth || !db) throw new Error('Firebase is not initialized');
    
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
        return null;
    }

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (!userDoc.exists()) {
        return null;
    }

    return userDoc.data() as User;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
    userId: string,
    updates: Partial<User>
): Promise<void> => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');
    
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { ...updates, updatedAt: Date.now() }, { merge: true });
};
