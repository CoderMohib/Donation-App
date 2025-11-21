import { getCampaigns, subscribeToCampaigns } from '@/src/firebase';
import { Campaign } from '@/src/types';
import { asyncHandler } from '@/src/utils';
import { useEffect, useState } from 'react';

interface CampaignsFilters {
    status?: Campaign['status'];
    category?: Campaign['category'];
    ownerId?: string;
    limitCount?: number;
}

/**
 * Hook to fetch and subscribe to campaigns list with real-time updates
 */
export const useCampaigns = (filters?: CampaignsFilters, enableRealtime: boolean = true) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (enableRealtime) {
            // Subscribe to real-time updates
            const unsubscribe = subscribeToCampaigns(
                (updatedCampaigns) => {
                    setCampaigns(updatedCampaigns);
                    setLoading(false);
                },
                filters
            );

            // Cleanup subscription on unmount
            return () => unsubscribe();
        } else {
            // One-time fetch without real-time updates
            const fetchCampaigns = async () => {
                const [data, err] = await asyncHandler(getCampaigns(filters));

                if (err) {
                    setError(err);
                    setLoading(false);
                    return;
                }

                setCampaigns(data || []);
                setLoading(false);
            };

            fetchCampaigns();
        }
    }, [filters?.status, filters?.category, filters?.ownerId, filters?.limitCount, enableRealtime]);

    const refetch = async () => {
        setLoading(true);
        const [data, err] = await asyncHandler(getCampaigns(filters));

        if (err) {
            setError(err);
        } else {
            setCampaigns(data || []);
        }

        setLoading(false);
    };

    return { campaigns, loading, error, refetch };
};
