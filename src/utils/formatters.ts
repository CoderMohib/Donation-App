/**
 * Format currency to USD
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Format date to readable string
 */
export const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date);
};

/**
 * Format relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (current: number, goal: number): number => {
    if (goal === 0) return 0;
    return Math.min(Math.round((current / goal) * 100), 100);
};

/**
 * Calculate days remaining
 */
export const calculateDaysRemaining = (endDate: number): number => {
    const now = Date.now();
    const diff = endDate - now;
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
};

/**
 * Format Firebase error messages to user-friendly text
 */
export const formatFirebaseError = (error: any): string => {
    // If it's already a custom error message, return it
    if (error.message && !error.code) {
        return error.message;
    }

    // Handle Firebase error codes
    const errorCode = error.code || '';

    switch (errorCode) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
            return 'Invalid email or password. Please try again.';

        case 'auth/invalid-email':
            return 'Please enter a valid email address.';

        case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';

        case 'auth/email-already-in-use':
            return 'This email is already registered. Please sign in instead.';

        case 'auth/weak-password':
            return 'Password is too weak. Please use at least 6 characters.';

        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';

        case 'auth/network-request-failed':
            return 'Network error. Please check your connection and try again.';

        case 'auth/requires-recent-login':
            return 'Please sign in again to complete this action.';

        case 'auth/operation-not-allowed':
            return 'This operation is not allowed. Please contact support.';

        default:
            // Return a generic message for unknown errors
            return error.message || 'An unexpected error occurred. Please try again.';
    }
};
