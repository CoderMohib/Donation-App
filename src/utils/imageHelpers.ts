/**
 * Image validation and helper utilities
 */

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Validate image file size
 */
export const validateImageSize = (sizeInBytes: number): boolean => {
  return sizeInBytes <= MAX_IMAGE_SIZE;
};

/**
 * Validate image file type
 */
export const validateImageType = (mimeType: string): boolean => {
  return ALLOWED_IMAGE_TYPES.includes(mimeType.toLowerCase());
};

/**
 * Get human-readable file size
 */
export const getReadableFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Generate Cloudinary URL with transformations
 */
export const getCloudinaryUrl = (
  publicId: string,
  cloudName: string,
  options?: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
    quality?: number | 'auto';
    format?: 'auto' | 'jpg' | 'png' | 'webp';
  }
): string => {
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  
  const transformations: string[] = [];
  
  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  if (options?.crop) transformations.push(`c_${options.crop}`);
  if (options?.quality) transformations.push(`q_${options.quality}`);
  if (options?.format) transformations.push(`f_${options.format}`);
  
  const transformString = transformations.length > 0 ? transformations.join(',') + '/' : '';
  
  return `${baseUrl}/${transformString}${publicId}`;
};
