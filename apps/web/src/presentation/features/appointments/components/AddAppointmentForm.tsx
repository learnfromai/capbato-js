import React, { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button,
  Select,
  Stack,
  Autocomplete,
  Title,
  Alert,
  Text,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { 
  AddAppointmentFormSchema,
  VISIT_REASONS,
  type AddAppointmentFormData 
} from '@nx-starter/application-shared';
import { FormTextInput } from '../../../components/ui/FormTextInput';
import { 
  searchPatients,
  getDoctorSelectOptions,
  getTimeSlotSelectOptions,
  type Patient
} from '../data/mockData';

interface AddAppointmentFormProps {
  onSubmit: (data: AddAppointmentFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * AddAppointmentForm component handles the creation of new appointments
 * with form validation, patient autocomplete, and proper TypeScript typing.
 */
export const AddAppointmentForm: React.FC<AddAppointmentFormProps> = ({
  onSubmit,
  isLoading = false,
  error
}) => {
  const [patientSuggestions, setPatientSuggestions] = useState<Patient[]>([]);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddAppointmentFormData>({
    resolver: zodResolver(AddAppointmentFormSchema),
    mode: 'onChange',
    defaultValues: {
      patientName: '',
      reasonForVisit: undefined, // Change from empty string to undefined
      date: '',
      time: '',
      doctorId: '',
    },
  });

  // Watch form values for button state
  const patientName = watch('patientName');
  const reasonForVisit = watch('reasonForVisit');
  const date = watch('date');
  const time = watch('time');
  const doctorId = watch('doctorId');

  // Check if required form fields are empty
  const isFormEmpty = !patientName?.trim() || 
                     !reasonForVisit?.trim() || 
                     !date?.trim() || 
                     !time?.trim() || 
                     !doctorId?.trim();

  // Memoized select options
  const visitReasonOptions = useMemo(() => {
    return VISIT_REASONS.map(reason => ({
      value: reason,
      label: reason,
    }));
  }, []);

  const doctorOptions = useMemo(() => getDoctorSelectOptions(), []);
  const timeSlotOptions = useMemo(() => getTimeSlotSelectOptions(), []);

  // Handle patient name autocomplete
  const handlePatientSearch = (query: string) => {
    if (query.length >= 2) {
      const suggestions = searchPatients(query);
      setPatientSuggestions(suggestions);
      return suggestions.map(patient => patient.fullName);
    }
    setPatientSuggestions([]);
    return [];
  };

  // Handle patient selection from autocomplete
  const handlePatientSelect = (patientName: string) => {
    const selectedPatient = patientSuggestions.find(p => p.fullName === patientName);
    if (selectedPatient) {
      setValue('patientName', selectedPatient.fullName, { shouldValidate: true });
    }
  };

  // Format date for form submission
  const formatDateForSubmission = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data);
    reset(); // Reset form after successful submission
    setPatientSuggestions([]); // Clear suggestions
  });

  // Get minimum date (today)
  const minDate = new Date();

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      <Stack gap="md">
        {error && (
          <Alert color="red" style={{ marginBottom: '10px' }}>
            {error}
          </Alert>
        )}

        <Title order={3} mb="xs">
          Add Appointment
        </Title>

        {/* Patient Name with Autocomplete */}
        <Controller
          name="patientName"
          control={control}
          render={({ field, fieldState }) => (
            <Autocomplete
              {...field}
              label="Patient Name"
              placeholder="Enter patient name"
              data={field.value ? handlePatientSearch(field.value) : []}
              onOptionSubmit={handlePatientSelect}
              error={fieldState.error?.message}
              disabled={isLoading}
              required
              limit={5}
              withAsterisk
            />
          )}
        />

        {/* Reason for Visit */}
        <Controller
          name="reasonForVisit"
          control={control}
          render={({ field, fieldState }) => (
            <Select
              {...field}
              label="Reason for Visit"
              placeholder="Select Reason"
              data={visitReasonOptions}
              error={fieldState.error?.message}
              disabled={isLoading}
              required
              withAsterisk
              searchable
            />
          )}
        />

        {/* Date */}
        <Controller
          name="date"
          control={control}
          render={({ field, fieldState }) => (
            <DateInput
              label="Date"
              placeholder="Select appointment date"
              value={field.value ? new Date(field.value) : null}
              onChange={(value) => field.onChange(value)}
              error={fieldState.error?.message}
              disabled={isLoading}
              required
              withAsterisk
              minDate={minDate}
              clearable
            />
          )}
        />

        {/* Time */}
        <Controller
          name="time"
          control={control}
          render={({ field, fieldState }) => (
            <Select
              {...field}
              label="Time"
              placeholder="Select Time"
              data={timeSlotOptions}
              error={fieldState.error?.message}
              disabled={isLoading}
              required
              withAsterisk
              searchable
            />
          )}
        />

        <Text size="xs" c="orange" style={{ marginTop: '-8px', marginBottom: '8px' }}>
          All time slots are full for this day.
        </Text>

        {/* Doctor Selection */}
        <Controller
          name="doctorId"
          control={control}
          render={({ field, fieldState }) => (
            <Select
              {...field}
              label="Select Doctor"
              placeholder="Select Doctor"
              data={doctorOptions}
              error={fieldState.error?.message}
              disabled={isLoading}
              required
              withAsterisk
              searchable
            />
          )}
        />

        <Button
          type="submit"
          disabled={isFormEmpty || isLoading}
          loading={isLoading}
          fullWidth
          mt="md"
          leftSection={<span>📅</span>}
        >
          {isLoading ? 'Adding Appointment...' : 'Add Appointment'}
        </Button>
      </Stack>
    </form>
  );
};