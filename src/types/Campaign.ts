export interface Campaign {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    goalAmount: number;
    currentAmount: number;
    createdBy: string; // User ID
    createdByName?: string;
    category?: 'education' | 'health' | 'disaster' | 'community' | 'other';
    status: 'active' | 'completed' | 'paused';
    createdAt: number;
    updatedAt: number;
    endDate?: number;
}

export interface CampaignWithProgress extends Campaign {
    progressPercentage: number;
    donorCount: number;
    daysRemaining?: number;
}
