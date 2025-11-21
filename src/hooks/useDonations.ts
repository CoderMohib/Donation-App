import { getUserDonations, subscribeToDonations } from '@/src/firebase';
import { Donation } from '@/src/types';
import { asyncHandler } from '@/src/utils';
import { useEffect, useState } from 'react';

/**
 * Hook to fetch and subscribe to donations with real-time updates
 */
export const useDonations = (
    campaignId?: string,
    userId?: string,
    limitCount?: number,
    enableRealtime: boolean = true
) => {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (enableRealtime && campaignId) {
            // Subscribe to campaign donations with real-time updates
            const unsubscribe = subscribeToDonations(
                campaignId,
                (updatedDonations) => {
                    setDonations(updatedDonations);
                    setLoading(false);
                },
                limitCount
            );

            // Cleanup subscription on unmount
            return () => unsubscribe();
        } else if (userId) {
            // Fetch user donations (one-time)
            const fetchUserDonations = async () => {
                const [data, err] = await asyncHandler(getUserDonations(userId, limitCount));

                if (err) {
                    setError(err);
                    setLoading(false);
                    return;
                }

                setDonations(data || []);
                setLoading(false);
            };

            fetchUserDonations();
        } else {
            setLoading(false);
        }
    }, [campaignId, userId, limitCount, enableRealtime]);

    const refetch = async () => {
        if (!userId) return;

        setLoading(true);
        const [data, err] = await asyncHandler(getUserDonations(userId, limitCount));

        if (err) {
            setError(err);
        } else {
            setDonations(data || []);
        }

        setLoading(false);
    };

    return { donations, loading, error, refetch };
};
