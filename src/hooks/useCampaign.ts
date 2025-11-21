import { getCampaign, subscribeToCampaign } from '@/src/firebase';
import { Campaign } from '@/src/types';
import { asyncHandler } from '@/src/utils';
import { useEffect, useState } from 'react';

/**
 * Hook to fetch and subscribe to a single campaign with real-time updates
 */
export const useCampaign = (campaignId: string | null) => {
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!campaignId) {
            setLoading(false);
            return;
        }

        // Initial fetch
        const fetchCampaign = async () => {
            const [data, err] = await asyncHandler(getCampaign(campaignId));

            if (err) {
                setError(err);
                setLoading(false);
                return;
            }

            setCampaign(data);
            setLoading(false);
        };

        fetchCampaign();

        // Subscribe to real-time updates
        const unsubscribe = subscribeToCampaign(campaignId, (updatedCampaign) => {
            setCampaign(updatedCampaign);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [campaignId]);

    return { campaign, loading, error };
};
