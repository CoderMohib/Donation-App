export interface CampaignUpdate {
  id: string;
  campaignId: string;
  title: string;
  message: string;
  createdAt: number;
  createdBy: string; // userId of campaign owner
}
