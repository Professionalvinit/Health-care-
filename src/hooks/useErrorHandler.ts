import { useState, useCallback } from 'react';
import { AppError, ErrorState } from '@/types/health';
import { handleApiError } from '@/utils/api';

interface UseErrorHandlerReturn {
  errorState: ErrorState;
  showError: (error: unknown) => void;
  clearError: () => void;
  retry: () => void;
  setRetryAction: (action: () => void) => void;
}

export function useErrorHandler(): UseErrorHandlerReturn {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    retryCount: 0,
  });
  
  const [retryAction, setRetryAction] = useState<(() => void) | null>(null);

  const showError = useCallback((error: unknown) => {
    const appError = handleApiError(error);
    setErrorState(prev => ({
      hasError: true,
      error: appError,
      retryCount: prev.retryCount,
    }));
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      retryCount: 0,
    });
  }, []);

  const retry = useCallback(() => {
    if (retryAction) {
      setErrorState(prev => ({
        ...prev,
        retryCount: prev.retryCount + 1,
      }));
      retryAction();
    }
  }, [retryAction]);

  const setRetryActionCallback = useCallback((action: () => void) => {
    setRetryAction(() => action);
  }, []);

  return {
    errorState,
    showError,
    clearError,
    retry,
    setRetryAction: setRetryActionCallback,
  };
}

// Toast notification hook (simple implementation)
interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  isVisible: boolean;
}

interface UseToastReturn {
  toast: ToastState;
  showToast: (message: string, type?: ToastState['type']) => void;
  hideToast: () => void;
}

export function useToast(): UseToastReturn {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const showToast = useCallback((message: string, type: ToastState['type'] = 'info') => {
    setToast({
      message,
      type,
      isVisible: true,
    });

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 5000);
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
}
