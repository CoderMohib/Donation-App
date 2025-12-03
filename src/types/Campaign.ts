export interface Campaign {
    id: string;
    title: string;
    shortDescription: string; // Brief description for cards
    fullDescription: string; // Detailed description for detail page
    imageUrl?: string;
    targetAmount: number; // Goal amount to raise
    donatedAmount: number; // Current amount donated
    ownerId: string; // User ID of campaign creator
    ownerName: string; // Name of campaign creator
    category?: 'education' | 'health' | 'disaster' | 'community' | 'other';
    status: 'draft' | 'in_progress' | 'completed' | 'ended';
    // Approval workflow fields (optional, for admin approval feature)
    approvalStatus?: 'pending' | 'approved' | 'rejected';
    approvalDate?: number;
    approvedBy?: string; // Admin user ID
    rejectionReason?: string;
    createdAt: number;
    updatedAt: number;
    endDate?: number;
}

export interface CampaignWithProgress extends Campaign {
    progressPercentage: number;
    donorCount: number;
    daysRemaining?: number;
}
