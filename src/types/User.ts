export interface User {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
    role?: 'user' | 'admin';
    createdAt: number;
    updatedAt: number;
}

export interface UserProfile extends User {
    phone?: string;
    bio?: string;
    totalDonations?: number;
    donationCount?: number;
}
