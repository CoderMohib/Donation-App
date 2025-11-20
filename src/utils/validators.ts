/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password strength
 * At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
export const validatePassword = (password: string): {
    isValid: boolean;
    message?: string;
} => {
    if (password.length < 8) {
        return { isValid: false, message: 'Password must be at least 8 characters' };
    }

    if (!/[A-Z]/.test(password)) {
        return { isValid: false, message: 'Password must contain an uppercase letter' };
    }

    if (!/[a-z]/.test(password)) {
        return { isValid: false, message: 'Password must contain a lowercase letter' };
    }

    if (!/[0-9]/.test(password)) {
        return { isValid: false, message: 'Password must contain a number' };
    }

    return { isValid: true };
};

/**
 * Validate name (at least 2 characters, letters only)
 */
export const validateName = (name: string): boolean => {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
};

/**
 * Validate donation amount
 */
export const validateAmount = (amount: number): {
    isValid: boolean;
    message?: string;
} => {
    if (amount <= 0) {
        return { isValid: false, message: 'Amount must be greater than 0' };
    }

    if (amount > 1000000) {
        return { isValid: false, message: 'Amount cannot exceed $1,000,000' };
    }

    return { isValid: true };
};

/**
 * Validate required field
 */
export const validateRequired = (value: string, fieldName: string): {
    isValid: boolean;
    message?: string;
} => {
    if (!value || value.trim().length === 0) {
        return { isValid: false, message: `${fieldName} is required` };
    }

    return { isValid: true };
};
