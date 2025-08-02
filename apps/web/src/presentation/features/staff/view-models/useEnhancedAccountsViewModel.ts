import { useEffect, useState, useCallback } from 'react';
import { useUserStore } from '../../../../infrastructure/state/UserStore';
import { container, TOKENS } from '../../../../infrastructure/di/container';
import { IAuthCommandService, RegisterUserCommand, UserDto } from '@nx-starter/application-shared';
import { extractErrorMessage, isApiError } from '../../../../infrastructure/utils/ErrorMapping';

// Utility function to parse validation error details
const parseValidationErrors = (error: unknown): Record<string, string> => {
  if (isApiError(error)) {
    const apiError = error as any;
    const backendError = apiError.response?.data;
    
    // Check if it's a validation error with details
    if (backendError?.code === 'VALIDATION_ERROR' && backendError.details) {
      const fieldErrors: Record<string, string> = {};
      
      backendError.details.forEach((detail: any) => {
        if (detail.path && detail.path.length > 0 && detail.message) {
          const fieldName = detail.path[0]; // Use first path element as field name
          fieldErrors[fieldName] = detail.message;
        }
      });
      
      return fieldErrors;
    }
  }
  
  return {};
};

// Local Account interface for the view layer
export interface Account {
  id: string; // Changed from number to string to match API
  firstName: string;
  lastName: string;
  role: 'admin' | 'doctor' | 'receptionist';
  email: string;
  mobile?: string;
}

export interface CreateAccountData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  mobile?: string;
  // Doctor profile fields (optional, only required when role is 'doctor')
  specialization?: string;
  licenseNumber?: string;
  experienceYears?: number;
}

/**
 * Enhanced Accounts View Model Interface
 * Contract between view model and views
 */
export interface IAccountsViewModel {
  // State
  accounts: Account[];
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  
  // Actions
  loadAccounts: () => Promise<void>;
  createAccount: (data: CreateAccountData) => Promise<boolean>;
  changeAccountPassword: (accountId: string, newPassword: string) => Promise<boolean>;
  deleteAccount: (accountId: string) => Promise<void>;
  clearError: () => void;
  clearFieldErrors: () => void;
  refreshAccounts: () => Promise<void>;
}

/**
 * Enhanced Accounts View Model Implementation
 * Handles presentation logic and coordinates with application services
 */
export const useAccountsViewModel = (): IAccountsViewModel => {
  const { users, isLoading: storeLoading, error: storeError, fetchUsers, clearError: clearStoreError } = useUserStore();
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Transform UserDto to Account for the view layer
  const transformUserToAccount = useCallback((user: UserDto): Account => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role as 'admin' | 'doctor' | 'receptionist',
    email: user.email,
    mobile: user.mobile,
  }), []);

  // Convert users to accounts for the view
  const accounts: Account[] = users.map(transformUserToAccount);

  // Combined loading state
  const isLoading = storeLoading || localLoading;

  // Combined error state (prefer local error over store error)
  const error = localError || storeError;

  // Load accounts on mount
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = useCallback(async () => {
    clearLocalError();
    await fetchUsers();
  }, [fetchUsers]);

  const refreshAccounts = useCallback(async () => {
    await loadAccounts();
  }, [loadAccounts]);

  const createAccount = useCallback(async (data: CreateAccountData): Promise<boolean> => {
    setLocalLoading(true);
    setLocalError(null);
    setFieldErrors({});
    
    try {
      // Get the auth command service from the container
      const authCommandService = container.resolve<IAuthCommandService>(TOKENS.AuthCommandService);
      
      // Create the register command with all data (backend handles doctor profile creation)
      const registerCommand: RegisterUserCommand = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
        mobile: data.mobile,
        // Doctor profile fields (backend will handle when role is 'doctor')
        specialization: data.specialization,
        licenseNumber: data.licenseNumber,
        experienceYears: data.experienceYears,
      };
      
      // Call the API to create the user account (backend handles doctor profile creation)
      await authCommandService.register(registerCommand);
      
      // Refresh the accounts list to show the new account
      await refreshAccounts();
      
      return true;
    } catch (err) {
      // Parse validation errors first
      const validationErrors = parseValidationErrors(err);
      
      if (Object.keys(validationErrors).length > 0) {
        // Set field-specific errors
        setFieldErrors(validationErrors);
        // Don't set generic error message when we have field-specific errors
        setLocalError(null);
      } else {
        // For non-validation errors or validation errors without field details
        const errorMessage = extractErrorMessage(err);
        setLocalError(errorMessage);
        // Clear any previous field errors
        setFieldErrors({});
      }
      
      return false;
    } finally {
      setLocalLoading(false);
    }
  }, [refreshAccounts]);

  const changeAccountPassword = useCallback(async (accountId: string, newPassword: string): Promise<boolean> => {
    setLocalLoading(true);
    setLocalError(null);
    
    try {
      // TODO: Implement actual password change logic with API
      // For now, simulate the operation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('Changing password for account:', accountId, newPassword);
      
      return true;
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to change password');
      return false;
    } finally {
      setLocalLoading(false);
    }
  }, []);

  const deleteAccount = useCallback(async (accountId: string): Promise<void> => {
    setLocalLoading(true);
    setLocalError(null);
    
    try {
      // TODO: Implement actual delete logic with API
      // For now, simulate the operation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('Deleting account:', accountId);
      
      // Refresh accounts after deletion
      await refreshAccounts();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to delete account');
    } finally {
      setLocalLoading(false);
    }
  }, [refreshAccounts]);

  const clearLocalError = useCallback(() => {
    setLocalError(null);
  }, []);

  const clearFieldErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  const clearError = useCallback(() => {
    clearLocalError();
    clearFieldErrors();
    clearStoreError();
  }, [clearStoreError]);

  return {
    accounts,
    isLoading,
    error,
    fieldErrors,
    loadAccounts,
    createAccount,
    changeAccountPassword,
    deleteAccount,
    clearError,
    clearFieldErrors,
    refreshAccounts,
  };
};
