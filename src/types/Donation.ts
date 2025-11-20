export interface Donation {
    id: string;
    campaignId: string;
    campaignTitle?: string;
    donorId: string;
    donorName?: string;
    amount: number;
    message?: string;
    isAnonymous: boolean;
    paymentMethod?: 'card' | 'paypal' | 'bank';
    transactionId?: string;
    status: 'pending' | 'completed' | 'failed';
    donatedAt: number;
}

export interface DonationSummary {
    totalAmount: number;
    donationCount: number;
    lastDonation?: Donation;
}
