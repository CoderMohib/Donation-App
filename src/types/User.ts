export interface User {
    id: string;
    name: string;
    email: string;
    photoURL?: string;
    role: 'user' | 'admin'; // Required field
    totalDonated: number; // Total amount donated by user
    donationCount: number; // Total number of donations made
    totalCampaigns: number; // Total campaigns created by user
    createdAt: number;
    updatedAt: number;
}

export interface UserProfile extends User {
    phone?: string;
    bio?: string;
}
