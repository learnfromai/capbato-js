import React from 'react';
import { Control, FieldErrors, UseFormRegister, Controller } from 'react-hook-form';
import { Stack, Select } from '@mantine/core';
import { FormTextInput } from '../../../components/ui/FormTextInput';
import type { CreateAccountData } from '../view-models/useEnhancedAccountsViewModel';

interface Step1FieldsProps {
  control: Control<CreateAccountData>;
  errors: FieldErrors<CreateAccountData>; 
  isLoading: boolean;
  register: UseFormRegister<CreateAccountData>;
  onInputChange?: () => void;
  fieldErrors?: Record<string, string>;
}

export const Step1Fields: React.FC<Step1FieldsProps> = ({
  control,
  errors,
  isLoading,
  register,
  onInputChange,
  fieldErrors = {}
}) => {
  return (
    <Stack gap="md">
      <FormTextInput
        label="First Name"
        placeholder="Enter first name"
        error={errors.firstName || fieldErrors.firstName}
        disabled={isLoading}
        required
        {...register('firstName')}
        onChange={(e) => {
          register('firstName').onChange(e);
          onInputChange?.();
        }}
      />
      
      <FormTextInput
        label="Last Name"
        placeholder="Enter last name"
        error={errors.lastName || fieldErrors.lastName}
        disabled={isLoading}
        required
        {...register('lastName')}
        onChange={(e) => {
          register('lastName').onChange(e);
          onInputChange?.();
        }}
      />
      
      <FormTextInput
        label="Email"
        type="email"
        placeholder="Enter email"
        error={errors.email || fieldErrors.email}
        disabled={isLoading}
        required
        {...register('email')}
        onChange={(e) => {
          register('email').onChange(e);
          onInputChange?.();
        }}
      />
      
      <FormTextInput
        label="Password"
        type="password"
        placeholder="Enter password"
        error={errors.password || fieldErrors.password}
        disabled={isLoading}
        required
        {...register('password')}
        onChange={(e) => {
          register('password').onChange(e);
          onInputChange?.();
        }}
      />
      
      <Controller
        name="role"
        control={control}
        render={({ field, fieldState }) => (
          <Select
            label="Role"
            placeholder="Select role"
            error={fieldState.error?.message || fieldErrors.role}
            data={[
              { value: 'admin', label: 'Admin' },
              { value: 'receptionist', label: 'Receptionist' },
              { value: 'doctor', label: 'Doctor' }
            ]}
            disabled={isLoading}
            required
            {...field}
          />
        )}
      />
    </Stack>
  );
};