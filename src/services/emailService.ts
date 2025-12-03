/**
 * Email service for Donation App
 * Sends emails via Express.js backend with Nodemailer
 */

// Get backend URL from environment variable
// In Expo, use EXPO_PUBLIC_ prefix for environment variables
const EMAIL_BACKEND_URL = process.env.EXPO_PUBLIC_EMAIL_BACKEND_URL || 'http://192.168.100.40:3000';

/**
 * Send donation notification email to campaign owner
 */
export const sendDonationNotificationEmail = async (
    campaignOwnerEmail: string,
    data: {
        campaignOwnerName: string;
        campaignTitle: string;
        donorName: string;
        amount: number;
        message?: string;
        isAnonymous: boolean;
        campaignId: string;
        totalRaised: number;
        targetAmount: number;
    }
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
    try {
        console.log(`📧 Sending donation notification to: ${campaignOwnerEmail}`);

        const response = await fetch(`${EMAIL_BACKEND_URL}/api/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'donation-notification',
                to: campaignOwnerEmail,
                data: data,
            }),
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Donation notification email sent successfully!');
            return {
                success: true,
                messageId: result.messageId,
            };
        } else {
            console.error('❌ Failed to send donation notification:', result.error);
            return {
                success: false,
                error: result.error || 'Failed to send donation notification',
            };
        }
    } catch (error: any) {
        console.error('❌ Error sending donation notification email:', error);
        return {
            success: false,
            error: error.message || 'Failed to send donation notification',
        };
    }
};

/**
 * Send thank you email to donor
 */
export const sendThankYouEmail = async (
    donorEmail: string,
    data: {
        donorName: string;
        campaignTitle: string;
        campaignOwnerName: string;
        amount: number;
        message?: string;
        campaignId: string;
        isAnonymous: boolean;
    }
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
    try {
        console.log(`📧 Sending thank you email to: ${donorEmail}`);

        const response = await fetch(`${EMAIL_BACKEND_URL}/api/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'thank-you',
                to: donorEmail,
                data: data,
            }),
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Thank you email sent successfully!');
            return {
                success: true,
                messageId: result.messageId,
            };
        } else {
            console.error('❌ Failed to send thank you email:', result.error);
            return {
                success: false,
                error: result.error || 'Failed to send thank you email',
            };
        }
    } catch (error: any) {
        console.error('❌ Error sending thank you email:', error);
        return {
            success: false,
            error: error.message || 'Failed to send thank you email',
        };
    }
};

/**
 * Send both donation notification and thank you emails
 */
export const sendDonationEmails = async (
    campaignOwnerEmail: string,
    donorEmail: string,
    donationData: {
        campaignOwnerName: string;
        campaignTitle: string;
        donorName: string;
        amount: number;
        message?: string;
        isAnonymous: boolean;
        campaignId: string;
        totalRaised: number;
        targetAmount: number;
    }
): Promise<{
    notificationSent: boolean;
    thankYouSent: boolean;
    errors: string[];
}> => {
    try {
        console.log('📧 Sending donation emails...');

        const response = await fetch(`${EMAIL_BACKEND_URL}/api/send-donation-emails`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                campaignOwnerEmail,
                donorEmail,
                donationData,
            }),
        });

        const result = await response.json();

        if (result.errors && result.errors.length > 0) {
            console.warn('⚠️ Some emails failed to send:', result.errors);
        } else {
            console.log('✅ All donation emails sent successfully!');
        }

        return {
            notificationSent: result.notificationSent || false,
            thankYouSent: result.thankYouSent || false,
            errors: result.errors || [],
        };
    } catch (error: any) {
        console.error('❌ Error sending donation emails:', error);
        return {
            notificationSent: false,
            thankYouSent: false,
            errors: [error.message || 'Failed to send donation emails'],
        };
    }
};

/**
 * Verify email backend connection
 */
export const verifyEmailConnection = async (): Promise<boolean> => {
    try {
        console.log('🔍 Verifying email backend connection...');
        
        const response = await fetch(`${EMAIL_BACKEND_URL}/api/health`, {
            method: 'GET',
        });

        const result = await response.json();

        if (result.status === 'ok') {
            console.log('✅ Email backend is connected and ready');
            return true;
        } else {
            console.error('❌ Email backend returned unexpected status:', result);
            return false;
        }
    } catch (error) {
        console.error('❌ Email backend verification failed:', error);
        return false;
    }
};
