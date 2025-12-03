import { Campaign } from '../types/Campaign';
import { Donation } from '../types/Donation';
import { User } from '../types/User';

/**
 * Process donations data for trend chart (line chart over time)
 */
export const processDonationTrendData = (
  donations: Donation[],
  days: number = 30
) => {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // Create a map for all dates in range
  const dateMap: Record<string, { amount: number; count: number }> = {};

  // Initialize all dates with 0
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateKey = date.toISOString().split('T')[0];
    dateMap[dateKey] = { amount: 0, count: 0 };
  }

  // Aggregate donations by date
  donations.forEach((donation) => {
    const donationDate = new Date(donation.donatedAt);
    if (donationDate >= startDate && donation.status === 'completed') {
      const dateKey = donationDate.toISOString().split('T')[0];
      if (dateMap[dateKey]) {
        dateMap[dateKey].amount += donation.amount;
        dateMap[dateKey].count += 1;
      }
    }
  });

  // Convert to array and format for chart
  return Object.entries(dateMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => {
      const d = new Date(date);
      const label = `${d.getDate()}/${d.getMonth() + 1}`;
      return {
        value: data.amount,
        label,
        count: data.count,
        date,
      };
    });
};

/**
 * Process campaign performance data (top campaigns by revenue)
 */
export const processCampaignPerformanceData = (
  donations: Donation[],
  campaigns: Campaign[],
  limit: number = 5
) => {
  // Aggregate donations by campaign
  const campaignMap: Record<
    string,
    { revenue: number; donationCount: number; name: string }
  > = {};

  donations.forEach((donation) => {
    if (donation.status === 'completed') {
      if (!campaignMap[donation.campaignId]) {
        const campaign = campaigns.find((c) => c.id === donation.campaignId);
        campaignMap[donation.campaignId] = {
          revenue: 0,
          donationCount: 0,
          name: campaign?.title || donation.campaignTitle || 'Unknown',
        };
      }
      campaignMap[donation.campaignId].revenue += donation.amount;
      campaignMap[donation.campaignId].donationCount += 1;
    }
  });

  // Sort by revenue and take top N
  return Object.entries(campaignMap)
    .sort(([, a], [, b]) => b.revenue - a.revenue)
    .slice(0, limit)
    .map(([id, data]) => ({
      campaignId: id,
      name: data.name.length > 20 ? data.name.substring(0, 20) + '...' : data.name,
      fullName: data.name,
      revenue: data.revenue,
      donationCount: data.donationCount,
    }));
};

/**
 * Process user growth data (new users over time)
 */
export const processUserGrowthData = (users: User[], months: number = 6) => {
  const now = new Date();
  const startDate = new Date(
    now.getFullYear(),
    now.getMonth() - months + 1,
    1
  );

  // Create map for each month
  const monthMap: Record<string, number> = {};

  // Initialize all months with 0
  for (let i = 0; i < months; i++) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - months + i + 1,
      1
    );
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthMap[monthKey] = 0;
  }

  // Count users by month
  users.forEach((user) => {
    const userDate = new Date(user.createdAt);
    if (userDate >= startDate) {
      const monthKey = `${userDate.getFullYear()}-${String(userDate.getMonth() + 1).padStart(2, '0')}`;
      if (monthMap[monthKey] !== undefined) {
        monthMap[monthKey] += 1;
      }
    }
  });

  // Convert to array and format for chart
  return Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => {
      const [year, monthNum] = month.split('-');
      const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const label = date.toLocaleString('default', { month: 'short' });
      return {
        value: count,
        label,
        month,
      };
    });
};

/**
 * Process donation status distribution (for pie chart)
 */
export const processDonationStatusData = (donations: Donation[]) => {
  const statusCounts = {
    completed: 0,
    pending: 0,
    failed: 0,
  };

  donations.forEach((donation) => {
    if (donation.status in statusCounts) {
      statusCounts[donation.status as keyof typeof statusCounts] += 1;
    }
  });

  const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

  return [
    {
      value: statusCounts.completed,
      color: '#10B981',
      text: 'Completed',
      percentage: total > 0 ? ((statusCounts.completed / total) * 100).toFixed(1) : '0',
    },
    {
      value: statusCounts.pending,
      color: '#F59E0B',
      text: 'Pending',
      percentage: total > 0 ? ((statusCounts.pending / total) * 100).toFixed(1) : '0',
    },
    {
      value: statusCounts.failed,
      color: '#EF4444',
      text: 'Failed',
      percentage: total > 0 ? ((statusCounts.failed / total) * 100).toFixed(1) : '0',
    },
  ].filter((item) => item.value > 0);
};

/**
 * Process monthly revenue data (for current year)
 */
export const processMonthlyRevenueData = (donations: Donation[]) => {
  const currentYear = new Date().getFullYear();
  const monthlyRevenue: Record<string, number> = {};

  // Initialize all months with 0
  for (let i = 0; i < 12; i++) {
    const monthKey = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
    monthlyRevenue[monthKey] = 0;
  }

  // Aggregate revenue by month
  donations.forEach((donation) => {
    const donationDate = new Date(donation.donatedAt);
    if (
      donationDate.getFullYear() === currentYear &&
      donation.status === 'completed'
    ) {
      const monthKey = `${currentYear}-${String(donationDate.getMonth() + 1).padStart(2, '0')}`;
      monthlyRevenue[monthKey] += donation.amount;
    }
  });

  const currentMonth = new Date().getMonth();

  // Convert to array and format for chart
  return Object.entries(monthlyRevenue).map(([month, revenue]) => {
    const monthNum = parseInt(month.split('-')[1]) - 1;
    const date = new Date(currentYear, monthNum, 1);
    const label = date.toLocaleString('default', { month: 'short' });
    const isCurrent = monthNum === currentMonth;

    return {
      value: revenue,
      label,
      frontColor: isCurrent ? '#ff7a5e' : '#ffb3a3',
      month,
    };
  });
};
