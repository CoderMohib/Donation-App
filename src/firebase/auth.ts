import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { User } from '../types';
import { auth, db, ensureFirebaseReady } from './firebase';

/**
 * Sign up a new user with email and password
 * Sends email verification automatically
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

    // Send email verification
    await sendEmailVerification(firebaseUser);

    // Create user document in Firestore
    const userData: User = {
        id: firebaseUser.uid,
        name,
        email: firebaseUser.email!,
        role: 'user',
        totalDonated: 0,
        donationCount: 0,
        totalCampaigns: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), userData);

    // Send welcome notification
    try {
        const { createNotification } = await import('../services/notificationService');
        await createNotification(
            firebaseUser.uid,
            'campaign_update',
            'Welcome to Donation App! 👋',
            'Thank you for joining our community. Start exploring campaigns and make a difference today!',
            {}
        );
    } catch (error) {
        console.error('Failed to send welcome notification:', error);
    }

    return userData;
};

/**
 * Sign in an existing user
 * Checks email verification status
 */
export const signIn = async (
    email: string,
    password: string
): Promise<User> => {
    ensureFirebaseReady();
    if (!auth || !db) throw new Error('Firebase is not initialized');

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Check email verification
        if (!firebaseUser.emailVerified) {
            throw new Error('Please verify your email before logging in. Check your inbox for the verification link.');
        }

        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

        if (!userDoc.exists()) {
            throw new Error('User data not found');
        }

        return userDoc.data() as User;
    } catch (error: any) {
        // Import formatFirebaseError at the top of the file
        const { formatFirebaseError } = await import('../utils/formatters');
        throw new Error(formatFirebaseError(error));
    }
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
 * Get user data by user ID
 */
export const getUserById = async (userId: string): Promise<User | null> => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');

    const userDoc = await getDoc(doc(db, 'users', userId));

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

// ==================== EMAIL VERIFICATION ====================

/**
 * Check if current user's email is verified
 */
export const checkEmailVerified = async (): Promise<boolean> => {
    ensureFirebaseReady();
    if (!auth) throw new Error('Firebase is not initialized');

    const user = auth.currentUser;
    if (!user) return false;

    // Reload user to get latest email verification status
    await user.reload();
    return user.emailVerified;
};

/**
 * Resend verification email to current user
 */
export const resendVerificationEmail = async (): Promise<void> => {
    ensureFirebaseReady();
    if (!auth) throw new Error('Firebase is not initialized');

    const user = auth.currentUser;
    if (!user) throw new Error('No user is currently signed in');

    await sendEmailVerification(user);
};

// ==================== ADMIN USER MANAGEMENT ====================

/**
 * Create a new user (Admin only)
 */
export const createUser = async (
    email: string,
    password: string,
    name: string,
    role: 'user' | 'admin' = 'user'
): Promise<User> => {
    ensureFirebaseReady();
    if (!auth || !db) throw new Error('Firebase is not initialized');

    // Note: This creates a user but doesn't sign them in
    // In a real app, you'd use Firebase Admin SDK on the backend
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    await updateProfile(firebaseUser, { displayName: name });

    const userData: User = {
        id: firebaseUser.uid,
        name,
        email: firebaseUser.email!,
        role,
        totalDonated: 0,
        donationCount: 0,
        totalCampaigns: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), userData);

    // Sign out the newly created user so admin stays signed in
    await signOut(auth);

    return userData;
};

/**
 * Update user data (Admin only)
 */
export const updateUser = async (
    userId: string,
    updates: Partial<User>
): Promise<void> => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { ...updates, updatedAt: Date.now() });
};

/**
 * Delete a user (Admin only)
 */
export const deleteUser = async (userId: string): Promise<void> => {
    ensureFirebaseReady();
    if (!auth || !db) throw new Error('Firebase is not initialized');

    // Delete user document from Firestore
    await deleteDoc(doc(db, 'users', userId));

    // Note: Deleting the Firebase Auth user requires Admin SDK
    // For now, we only delete the Firestore document
    // In production, you'd call a Cloud Function to delete the auth user
};

/**
 * Promote user to admin (Admin only)
 */
export const promoteToAdmin = async (userId: string): Promise<void> => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
        role: 'admin',
        updatedAt: Date.now()
    });
};

