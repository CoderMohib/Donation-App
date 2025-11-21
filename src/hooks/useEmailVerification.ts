import { checkEmailVerified, resendVerificationEmail } from '@/src/firebase';
import { asyncHandler } from '@/src/utils';
import { useEffect, useState } from 'react';

/**
 * Hook for checking email verification status with auto-check
 */
export const useEmailVerification = (autoCheckInterval: number = 5000) => {
    const [isVerified, setIsVerified] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const checkVerification = async () => {
        setIsChecking(true);
        const [verified, err] = await asyncHandler(checkEmailVerified());

        if (err) {
            setError(err);
            setIsChecking(false);
            return;
        }

        setIsVerified(verified || false);
        setIsChecking(false);
    };

    const resendEmail = async () => {
        const [_, err] = await asyncHandler(resendVerificationEmail());

        if (err) {
            setError(err);
            throw err;
        }
    };

    useEffect(() => {
        // Initial check
        checkVerification();

        // Set up interval for auto-check
        const interval = setInterval(checkVerification, autoCheckInterval);

        // Cleanup on unmount
        return () => clearInterval(interval);
    }, [autoCheckInterval]);

    return {
        isVerified,
        isChecking,
        error,
        checkVerification,
        resendEmail,
    };
};
