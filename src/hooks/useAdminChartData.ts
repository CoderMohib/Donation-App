import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { Campaign } from '../types/Campaign';
import { Donation } from '../types/Donation';
import { User } from '../types/User';
import {
    processCampaignPerformanceData,
    processDonationStatusData,
    processDonationTrendData,
    processMonthlyRevenueData,
    processUserGrowthData,
} from '../utils/chartDataProcessors';

export interface AdminChartData {
  donationTrend: ReturnType<typeof processDonationTrendData>;
  campaignPerformance: ReturnType<typeof processCampaignPerformanceData>;
  userGrowth: ReturnType<typeof processUserGrowthData>;
  donationStatus: ReturnType<typeof processDonationStatusData>;
  monthlyRevenue: ReturnType<typeof processMonthlyRevenueData>;
}

export const useAdminChartData = (timeRange: number = 30) => {
  const [chartData, setChartData] = useState<AdminChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadChartData = async () => {
    if (!db) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch all necessary data in parallel
      const [donationsSnapshot, usersSnapshot, campaignsSnapshot] =
        await Promise.all([
          getDocs(query(collection(db, 'donations'), orderBy('donatedAt', 'desc'))),
          getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'))),
          getDocs(collection(db, 'campaigns')),
        ]);

      const donations = donationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Donation[];

      const users = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];

      const campaigns = campaignsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Campaign[];

      // Process data for each chart
      const processedData: AdminChartData = {
        donationTrend: processDonationTrendData(donations, timeRange),
        campaignPerformance: processCampaignPerformanceData(donations, campaigns, 5),
        userGrowth: processUserGrowthData(users, 6),
        donationStatus: processDonationStatusData(donations),
        monthlyRevenue: processMonthlyRevenueData(donations),
      };

      setChartData(processedData);
      setLoading(false);
    } catch (err) {
      console.error('Error loading chart data:', err);
      setError(err as Error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChartData();
  }, [timeRange]);

  return {
    chartData,
    loading,
    error,
    refresh: loadChartData,
  };
};
