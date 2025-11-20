import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    increment,
    limit,
    orderBy,
    query,
    QueryConstraint,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import { Campaign, Donation } from '../types';
import { db, ensureFirebaseReady } from './firebase';

// ==================== CAMPAIGNS ====================

/**
 * Create a new campaign
 */
export const createCampaign = async (
    campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');
    
    const campaignRef = doc(collection(db, 'campaigns'));
    const campaign: Campaign = {
        ...campaignData,
        id: campaignRef.id,
        currentAmount: 0,
        status: 'active',
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    await setDoc(campaignRef, campaign);
    return campaignRef.id;
};

/**
 * Get a single campaign by ID
 */
export const getCampaign = async (campaignId: string): Promise<Campaign | null> => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');
    
    const campaignDoc = await getDoc(doc(db, 'campaigns', campaignId));

    if (!campaignDoc.exists()) {
        return null;
    }

    return campaignDoc.data() as Campaign;
};

/**
 * Get all campaigns with optional filters
 */
export const getCampaigns = async (
    filters?: {
        status?: Campaign['status'];
        category?: Campaign['category'];
        createdBy?: string;
        limitCount?: number;
    }
): Promise<Campaign[]> => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');
    
    const constraints: QueryConstraint[] = [];

    if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
    }
    if (filters?.category) {
        constraints.push(where('category', '==', filters.category));
    }
    if (filters?.createdBy) {
        constraints.push(where('createdBy', '==', filters.createdBy));
    }

    constraints.push(orderBy('createdAt', 'desc'));

    if (filters?.limitCount) {
        constraints.push(limit(filters.limitCount));
    }

    const q = query(collection(db, 'campaigns'), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => doc.data() as Campaign);
};

/**
 * Update a campaign
 */
export const updateCampaign = async (
    campaignId: string,
    updates: Partial<Campaign>
): Promise<void> => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');
    
    const campaignRef = doc(db, 'campaigns', campaignId);
    await updateDoc(campaignRef, { ...updates, updatedAt: Date.now() });
};

/**
 * Delete a campaign
 */
export const deleteCampaign = async (campaignId: string): Promise<void> => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');
    await deleteDoc(doc(db, 'campaigns', campaignId));
};

// ==================== DONATIONS ====================

/**
 * Create a new donation
 */
export const createDonation = async (
    donationData: Omit<Donation, 'id' | 'donatedAt'>
): Promise<string> => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');
    
    const donationRef = doc(collection(db, 'donations'));
    const donation: Donation = {
        ...donationData,
        id: donationRef.id,
        status: 'completed',
        donatedAt: Date.now(),
    };

    // Create donation document
    await setDoc(donationRef, donation);

    // Update campaign's current amount
    const campaignRef = doc(db, 'campaigns', donationData.campaignId);
    await updateDoc(campaignRef, {
        currentAmount: increment(donationData.amount),
        updatedAt: Date.now(),
    });

    return donationRef.id;
};

/**
 * Get donations for a specific campaign
 */
export const getCampaignDonations = async (
    campaignId: string,
    limitCount?: number
): Promise<Donation[]> => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');
    
    const constraints: QueryConstraint[] = [
        where('campaignId', '==', campaignId),
        orderBy('donatedAt', 'desc'),
    ];

    if (limitCount) {
        constraints.push(limit(limitCount));
    }

    const q = query(collection(db, 'donations'), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => doc.data() as Donation);
};

/**
 * Get donations by a specific user
 */
export const getUserDonations = async (
    userId: string,
    limitCount?: number
): Promise<Donation[]> => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');
    
    const constraints: QueryConstraint[] = [
        where('donorId', '==', userId),
        orderBy('donatedAt', 'desc'),
    ];

    if (limitCount) {
        constraints.push(limit(limitCount));
    }

    const q = query(collection(db, 'donations'), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => doc.data() as Donation);
};

/**
 * Get all donations (admin only)
 */
export const getAllDonations = async (limitCount?: number): Promise<Donation[]> => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');
    
    const constraints: QueryConstraint[] = [orderBy('donatedAt', 'desc')];

    if (limitCount) {
        constraints.push(limit(limitCount));
    }

    const q = query(collection(db, 'donations'), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => doc.data() as Donation);
};
