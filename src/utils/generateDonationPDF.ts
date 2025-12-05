import { Donation } from '@/src/types/Donation';
import { User } from '@/src/types/User';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

type FilterType = 'day' | 'month' | 'year';

interface PDFOptions {
  donations: Donation[];
  user: User;
  filter: FilterType;
  periodLabel: string;
}

/**
 * Generate HTML template for donation statement
 */
const generateHTMLTemplate = (options: PDFOptions): string => {
  const { donations, user, filter, periodLabel } = options;

  // Calculate totals
  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalDonations = donations.length;
  const uniqueCampaigns = new Set(donations.map(d => d.campaignId)).size;

  // Group donations by date for better organization
  const donationRows = donations
    .map(
      (donation) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #E5E7EB;">
        ${new Date(donation.donatedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #E5E7EB;">
        ${donation.campaignTitle || 'Campaign'}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; text-align: right; font-weight: 600; color: #10B981;">
        $${donation.amount.toFixed(2)}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; text-align: center;">
        <span style="background: ${
          donation.status === 'completed' ? '#D1FAE5' : '#FEF3C7'
        }; color: ${
        donation.status === 'completed' ? '#065F46' : '#92400E'
      }; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
          ${donation.status.toUpperCase()}
        </span>
      </td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Donation Statement</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            color: #1F2937;
            line-height: 1.6;
            padding: 40px;
            background: #F9FAFB;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #ff7a5e 0%, #ff9e8a 100%);
            color: white;
            padding: 40px;
            text-align: center;
          }
          

          
          .header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          
          .header p {
            font-size: 16px;
            opacity: 0.95;
          }
          
          .content {
            padding: 40px;
          }
          
          .info-section {
            margin-bottom: 32px;
            padding: 24px;
            background: #F9FAFB;
            border-radius: 8px;
            border-left: 4px solid #ff7a5e;
          }
          
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
          }
          
          .info-row:last-child {
            margin-bottom: 0;
          }
          
          .info-label {
            font-weight: 600;
            color: #6B7280;
          }
          
          .info-value {
            color: #1F2937;
            font-weight: 500;
          }
          
          .summary-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-bottom: 32px;
          }
          
          .summary-card {
            background: #F9FAFB;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #E5E7EB;
          }
          
          .summary-card h3 {
            font-size: 14px;
            color: #6B7280;
            margin-bottom: 8px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .summary-card p {
            font-size: 28px;
            font-weight: 700;
            color: #ff7a5e;
          }
          
          .table-container {
            margin-bottom: 32px;
            overflow-x: auto;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            background: white;
          }
          
          thead {
            background: #F9FAFB;
          }
          
          th {
            padding: 16px 12px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #E5E7EB;
          }
          
          th:nth-child(3),
          th:nth-child(4) {
            text-align: center;
          }
          
          td {
            font-size: 14px;
            color: #4B5563;
          }
          
          .footer {
            background: #F9FAFB;
            padding: 24px 40px;
            text-align: center;
            border-top: 1px solid #E5E7EB;
          }
          
          .footer p {
            color: #6B7280;
            font-size: 14px;
            margin-bottom: 8px;
          }
          
          .footer .thank-you {
            font-size: 18px;
            font-weight: 600;
            color: #ff7a5e;
            margin-bottom: 16px;
          }
          
          @media print {
            body {
              padding: 0;
              background: white;
            }
            
            .container {
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Donation Statement</h1>
            <p>${periodLabel}</p>
          </div>
          
          <div class="content">
            <div class="info-section">
              <div class="info-row">
                <span class="info-label">Donor Name:</span>
                <span class="info-value">${user.name || 'N/A'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${user.email || 'N/A'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Statement Period:</span>
                <span class="info-value">${periodLabel}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Generated On:</span>
                <span class="info-value">${new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</span>
              </div>
            </div>
            
            <div class="summary-cards">
              <div class="summary-card">
                <h3>Total Donated</h3>
                <p>$${totalAmount.toFixed(2)}</p>
              </div>
              <div class="summary-card">
                <h3>Donations</h3>
                <p>${totalDonations}</p>
              </div>
              <div class="summary-card">
                <h3>Campaigns</h3>
                <p>${uniqueCampaigns}</p>
              </div>
            </div>
            
            <h2 style="font-size: 20px; margin-bottom: 16px; color: #1F2937;">Donation Details</h2>
            
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Campaign</th>
                    <th style="text-align: right;">Amount</th>
                    <th style="text-align: center;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${donationRows}
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="footer">
            <p class="thank-you">Thank You for Your Generosity! 💚</p>
            <p>Your donations make a real difference in the lives of those we serve.</p>
            <p style="margin-top: 16px; font-size: 12px;">This is an automated statement. For questions, please contact support.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Generate and share donation statement PDF
 */
export const generateDonationPDF = async (
  options: PDFOptions
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Generate HTML content
    const htmlContent = generateHTMLTemplate(options);

    // Create PDF using expo-print
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
    });

    // Share the PDF
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Save Donation Statement',
        UTI: 'com.adobe.pdf',
      });
      return { success: true };
    } else {
      return { success: false, error: 'Sharing is not available on this device' };
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate PDF',
    };
  }
};
