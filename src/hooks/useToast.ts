import { useState } from 'react';
import { ToastType } from '../components/feedback/Toast';

interface ToastState {
    visible: boolean;
    message: string;
    type: ToastType;
}

export const useToast = () => {
    const [toast, setToast] = useState<ToastState>({
        visible: false,
        message: '',
        type: 'info',
    });

    const showToast = (message: string, type: ToastType = 'info') => {
        setToast({
            visible: true,
            message,
            type,
        });
    };

    const hideToast = () => {
        setToast((prev) => ({ ...prev, visible: false }));
    };

    return {
        toast,
        showToast,
        hideToast,
        showSuccess: (message: string) => showToast(message, 'success'),
        showError: (message: string) => showToast(message, 'error'),
        showWarning: (message: string) => showToast(message, 'warning'),
        showInfo: (message: string) => showToast(message, 'info'),
    };
};
