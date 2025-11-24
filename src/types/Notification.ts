export interface AppNotification {
  id: string;
  userId: string;
  type: 'donation' | 'campaign_update' | 'admin_action' | 'milestone';
  title: string;
  body: string;
  data: {
    campaignId?: string;
    donationId?: string;
    action?: string;
  };
  read: boolean;
  createdAt: number;
}
