import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes,
} from 'firebase/storage';
import { isStorageReady, storage } from './firebase';

/**
 * Upload an image to Firebase Storage
 */
export const uploadImage = async (
    uri: string,
    path: string
): Promise<string> => {
    if (!isStorageReady() || !storage) {
        throw new Error(
            'Firebase Storage is not available. Please upgrade your Firebase plan or enable Storage in your Firebase console.'
        );
    }
    
    try {
        // Fetch the image as a blob
        const response = await fetch(uri);
        const blob = await response.blob();

        // Create a reference to the storage location
        const storageRef = ref(storage, path);

        // Upload the blob
        await uploadBytes(storageRef, blob);

        // Get and return the download URL
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error: any) {
        // Check for quota/billing errors
        if (error?.code === 'storage/quota-exceeded' || 
            error?.message?.includes('upgrade') || 
            error?.message?.includes('plan')) {
            throw new Error(
                'Storage quota exceeded. Please upgrade your Firebase Storage plan in the Firebase Console.'
            );
        }
        console.error('Error uploading image:', error);
        throw error;
    }
};

/**
 * Upload profile picture
 */
export const uploadProfilePicture = async (
    userId: string,
    imageUri: string
): Promise<string> => {
    const path = `profiles/${userId}/profile_${Date.now()}.jpg`;
    return uploadImage(imageUri, path);
};

/**
 * Upload campaign image
 */
export const uploadCampaignImage = async (
    campaignId: string,
    imageUri: string
): Promise<string> => {
    const path = `campaigns/${campaignId}/image_${Date.now()}.jpg`;
    return uploadImage(imageUri, path);
};

/**
 * Delete an image from Firebase Storage
 */
export const deleteImage = async (imageUrl: string): Promise<void> => {
    if (!isStorageReady() || !storage) {
        throw new Error('Firebase Storage is not available.');
    }
    
    try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
    } catch (error: any) {
        // Check for quota/billing errors
        if (error?.code === 'storage/quota-exceeded' || 
            error?.message?.includes('upgrade') || 
            error?.message?.includes('plan')) {
            throw new Error(
                'Storage quota exceeded. Please upgrade your Firebase Storage plan.'
            );
        }
        console.error('Error deleting image:', error);
        throw error;
    }
};
