import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button,
  Stack,
  Text,
} from '@mantine/core';
import { UpdateDoctorScheduleCommandSchema } from '@nx-starter/application-shared';
import { FormTextInput } from '../../../components/ui/FormTextInput';
import { Icon } from '../../../components/common';
import type { UpdateDoctorScheduleFormData } from '../types';

interface UpdateDoctorScheduleFormProps {
  onSubmit: (data: UpdateDoctorScheduleFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  initialData?: Partial<UpdateDoctorScheduleFormData>;
}

/**
 * UpdateDoctorScheduleForm component handles updating doctor schedules
 * with form validation and proper TypeScript typing.
 */
export const UpdateDoctorScheduleForm: React.FC<UpdateDoctorScheduleFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
  initialData
}) => {
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UpdateDoctorScheduleFormData>({
    resolver: zodResolver(UpdateDoctorScheduleCommandSchema),
    mode: 'onChange',
    defaultValues: {
      doctorName: initialData?.doctorName || '',
      date: initialData?.date || '',
      time: initialData?.time || '',
    },
  });

  // Watch form values for button state
  const doctorName = watch('doctorName');
  const date = watch('date');
  const time = watch('time');

  // Check if required form fields are empty
  const isFormEmpty = !doctorName?.trim() || 
                     !date?.trim() || 
                     !time?.trim();

  const handleFormSubmit = handleSubmit(async (data: UpdateDoctorScheduleFormData) => {
    await onSubmit(data);
  });

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      <Stack gap="md">
        <Text
          style={{
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#0047ab',
            marginBottom: '10px'
          }}
        >
          Doctor Schedule
        </Text>

        <FormTextInput
          label="Doctor Name"
          placeholder="Enter doctor name"
          error={errors.doctorName}
          disabled={isLoading}
          required
          {...register('doctorName')}
        />
        
        <FormTextInput
          label="Date"
          type="date"
          placeholder="mm/dd/yyyy"
          error={errors.date}
          disabled={isLoading}
          required
          {...register('date')}
        />
        
        <FormTextInput
          label="Time"
          placeholder="e.g. 9AM - 5PM"
          error={errors.time}
          disabled={isLoading}
          required
          {...register('time')}
        />
        
        <Stack gap="xs" mt="md">
          <Button
            type="submit"
            disabled={isFormEmpty || isLoading}
            loading={isLoading}
            fullWidth
            style={{
              backgroundColor: '#4db6ac',
              borderColor: '#4db6ac'
            }}
            styles={{
              root: {
                '&:hover': {
                  backgroundColor: '#3ba69c'
                }
              }
            }}
          >
            <Icon icon="fas fa-save" style={{ marginRight: '8px' }} />
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            fullWidth
            style={{
              borderColor: '#dee2e6',
              color: '#6c757d'
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};