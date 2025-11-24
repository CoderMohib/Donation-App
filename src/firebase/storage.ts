import { CloudinaryUploadResponse } from '@/src/types/cloudinary';

/**
 * Cloudinary configuration from environment variables
 */
const getCloudinaryConfig = () => {
    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error(
            'Cloudinary configuration is missing. Please set EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME and EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env file.'
        );
    }

    return { cloudName, uploadPreset };
};

/**
 * Upload an image to Cloudinary
 */
export const uploadImage = async (
    uri: string,
    folder: string
): Promise<string> => {
    try {
        const { cloudName, uploadPreset } = getCloudinaryConfig();

        // Create form data
        const formData = new FormData();
        
        // Extract filename from URI
        const filename = uri.split('/').pop() || 'image.jpg';
        
        // Add image file to form data
        formData.append('file', {
            uri,
            type: 'image/jpeg',
            name: filename,
        } as any);
        
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', folder);

        // Upload to Cloudinary
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.error?.message || 'Failed to upload image to Cloudinary'
            );
        }

        const data: CloudinaryUploadResponse = await response.json();
        
        // Return the secure URL
        return data.secure_url;
    } catch (error: any) {
        console.error('Error uploading image to Cloudinary:', error);
        
        // Provide user-friendly error messages
        if (error.message?.includes('configuration')) {
            throw error;
        }
        
        if (error.message?.includes('network') || error.message?.includes('fetch')) {
            throw new Error(
                'Network error. Please check your internet connection and try again.'
            );
        }
        
        throw new Error('Failed to upload image. Please try again.');
    }
};

/**
 * Upload profile picture
 */
export const uploadProfilePicture = async (
    userId: string,
    imageUri: string
): Promise<string> => {
    const folder = `donation-app/profiles/${userId}`;
    return uploadImage(imageUri, folder);
};

/**
 * Upload campaign image
 */
export const uploadCampaignImage = async (
    campaignId: string,
    imageUri: string
): Promise<string> => {
    const folder = `donation-app/campaigns/${campaignId}`;
    return uploadImage(imageUri, folder);
};

/**
 * Delete an image from Cloudinary
 * Note: This requires server-side implementation with API secret
 * For now, we'll keep this as a placeholder
 */
export const deleteImage = async (imageUrl: string): Promise<void> => {
    // Cloudinary image deletion requires authenticated API calls
    // This would need to be implemented on a backend server
    // For the free tier with unsigned uploads, deletion is typically
    // handled through the Cloudinary dashboard
    console.warn('Image deletion is not implemented for client-side Cloudinary uploads');
};
