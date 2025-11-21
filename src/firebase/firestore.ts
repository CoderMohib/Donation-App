import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    increment,
    limit,
    onSnapshot,
    orderBy,
    query,
    QueryConstraint,
    runTransaction,
    setDoc,
    Unsubscribe,
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
        donatedAmount: 0,
        status: 'draft', // All campaigns start as draft
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
        ownerId?: string;
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
    if (filters?.ownerId) {
        constraints.push(where('ownerId', '==', filters.ownerId));
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

// ==================== CAMPAIGN LIFECYCLE ====================

/**
 * Start a campaign (draft → in_progress)
 */
export const startCampaign = async (campaignId: string): Promise<void> => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');

    const campaignRef = doc(db, 'campaigns', campaignId);
    await updateDoc(campaignRef, {
        status: 'in_progress',
        updatedAt: Date.now(),
    });
};

/**
 * End a campaign (Admin only)
 */
export const endCampaign = async (campaignId: string): Promise<void> => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');

    const campaignRef = doc(db, 'campaigns', campaignId);
    await updateDoc(campaignRef, {
        status: 'ended',
        updatedAt: Date.now(),
    });
};

/**
 * Check and auto-complete campaign if goal reached
 */
export const checkCampaignCompletion = async (campaignId: string): Promise<void> => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');

    const campaign = await getCampaign(campaignId);
    if (!campaign) return;

    // Auto-complete if goal reached and status is in_progress
    if (campaign.donatedAmount >= campaign.targetAmount && campaign.status === 'in_progress') {
        await updateDoc(doc(db, 'campaigns', campaignId), {
            status: 'completed',
            updatedAt: Date.now(),
        });
    }
};

// ==================== REAL-TIME LISTENERS ====================

/**
 * Subscribe to a single campaign's updates
 */
export const subscribeToCampaign = (
    campaignId: string,
    callback: (campaign: Campaign | null) => void
): Unsubscribe => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');

    const campaignRef = doc(db, 'campaigns', campaignId);

    return onSnapshot(campaignRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data() as Campaign);
        } else {
            callback(null);
        }
    });
};

/**
 * Subscribe to campaigns list with filters
 */
export const subscribeToCampaigns = (
    callback: (campaigns: Campaign[]) => void,
    filters?: {
        status?: Campaign['status'];
        category?: Campaign['category'];
        ownerId?: string;
        limitCount?: number;
    }
): Unsubscribe => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');

    const constraints: QueryConstraint[] = [];

    if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
    }
    if (filters?.category) {
        constraints.push(where('category', '==', filters.category));
    }
    if (filters?.ownerId) {
        constraints.push(where('ownerId', '==', filters.ownerId));
    }

    constraints.push(orderBy('createdAt', 'desc'));

    if (filters?.limitCount) {
        constraints.push(limit(filters.limitCount));
    }

    const q = query(collection(db, 'campaigns'), ...constraints);

    return onSnapshot(q, (querySnapshot) => {
        const campaigns = querySnapshot.docs.map(doc => doc.data() as Campaign);
        callback(campaigns);
    });
};

/**
 * Subscribe to donations for a campaign
 */
export const subscribeToDonations = (
    campaignId: string,
    callback: (donations: Donation[]) => void,
    limitCount?: number
): Unsubscribe => {
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

    return onSnapshot(q, (querySnapshot) => {
        const donations = querySnapshot.docs.map(doc => doc.data() as Donation);
        callback(donations);
    });
};

// ==================== SEARCH & FILTER ====================

/**
 * Search campaigns by title or description
 */
export const searchCampaigns = async (searchTerm: string): Promise<Campaign[]> => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');

    // Get all campaigns (Firestore doesn't support full-text search natively)
    const allCampaigns = await getCampaigns();

    // Filter client-side
    const searchLower = searchTerm.toLowerCase();
    return allCampaigns.filter(campaign =>
        campaign.title.toLowerCase().includes(searchLower) ||
        campaign.shortDescription.toLowerCase().includes(searchLower) ||
        campaign.fullDescription.toLowerCase().includes(searchLower)
    );
};

// ==================== DONATIONS ====================

/**
 * Create a new donation using Firestore transaction
 */
export const createDonation = async (
    donationData: Omit<Donation, 'id' | 'donatedAt' | 'timestamp' | 'status'>
): Promise<string> => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');

    const donationRef = doc(collection(db, 'donations'));
    const campaignRef = doc(db, 'campaigns', donationData.campaignId);

    // Use transaction to ensure atomic update
    await runTransaction(db, async (transaction) => {
        const campaignDoc = await transaction.get(campaignRef);

        if (!campaignDoc.exists()) {
            throw new Error('Campaign not found');
        }

        const campaign = campaignDoc.data() as Campaign;

        // Create donation
        const donation: Donation = {
            ...donationData,
            id: donationRef.id,
            status: 'completed',
            donatedAt: Date.now(),
            timestamp: Date.now(),
        };

        transaction.set(donationRef, donation);

        // Update campaign's donated amount
        const newDonatedAmount = campaign.donatedAmount + donationData.amount;
        transaction.update(campaignRef, {
            donatedAmount: newDonatedAmount,
            updatedAt: Date.now(),
        });

        // Auto-complete if goal reached
        if (newDonatedAmount >= campaign.targetAmount && campaign.status === 'in_progress') {
            transaction.update(campaignRef, {
                status: 'completed',
            });
        }
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

// ==================== USER STATISTICS ====================

/**
 * Update user's total donated amount
 */
export const updateUserDonationStats = async (
    userId: string,
    amount: number
): Promise<void> => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
        totalDonated: increment(amount),
        updatedAt: Date.now(),
    });
};

/**
 * Update user's total campaigns count
 */
export const updateUserCampaignStats = async (
    userId: string,
    incrementBy: number = 1
): Promise<void> => {
    ensureFirebaseReady();
    if (!db) throw new Error('Firebase is not initialized');

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
        totalCampaigns: increment(incrementBy),
        updatedAt: Date.now(),
    });
};
