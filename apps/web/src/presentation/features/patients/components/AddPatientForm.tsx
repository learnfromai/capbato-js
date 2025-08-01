import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button,
  Select,
  Stack,
  Grid,
  Title,
  Box,
  Group,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { CreatePatientCommandSchema, type CreatePatientCommand } from '@nx-starter/application-shared';
import { FormTextInput } from '../../../components/ui/FormTextInput';

interface AddPatientFormProps {
  onSubmit: (data: CreatePatientCommand) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

// Sample data for provinces, cities, and barangays
// In a real application, this would be fetched from an API
const PROVINCES = [
  { value: 'Metro Manila', label: 'Metro Manila' },
  { value: 'Cavite', label: 'Cavite' },
  { value: 'Laguna', label: 'Laguna' },
  { value: 'Rizal', label: 'Rizal' },
  { value: 'Bulacan', label: 'Bulacan' },
];

const CITIES = [
  { value: 'Quezon City', label: 'Quezon City' },
  { value: 'Manila', label: 'Manila' },
  { value: 'Makati', label: 'Makati' },
  { value: 'Taguig', label: 'Taguig' },
  { value: 'Pasig', label: 'Pasig' },
];

const BARANGAYS = [
  { value: 'Barangay 1', label: 'Barangay 1' },
  { value: 'Barangay 2', label: 'Barangay 2' },
  { value: 'Barangay 3', label: 'Barangay 3' },
  { value: 'Barangay 4', label: 'Barangay 4' },
  { value: 'Barangay 5', label: 'Barangay 5' },
];

const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
];

/**
 * AddPatientForm component for creating new patients
 * Matches the layout of the legacy add-new-patient.html with two-column design
 */
export const AddPatientForm: React.FC<AddPatientFormProps> = ({
  onSubmit,
  onCancel,
  isLoading
}) => {
  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<CreatePatientCommand>({
    resolver: zodResolver(CreatePatientCommandSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      dateOfBirth: '',
      gender: 'Male' as const,
      contactNumber: '',
      houseNumber: '',
      streetName: '',
      province: '',
      cityMunicipality: '',
      barangay: '',
      guardianName: '',
      guardianGender: 'Male' as const,
      guardianRelationship: '',
      guardianContactNumber: '',
      guardianHouseNumber: '',
      guardianStreetName: '',
      guardianProvince: '',
      guardianCityMunicipality: '',
      guardianBarangay: '',
    },
  });

  // Watch form values for validation state
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const dateOfBirth = watch('dateOfBirth');
  const gender = watch('gender');
  const contactNumber = watch('contactNumber');
  const houseNumber = watch('houseNumber');
  const streetName = watch('streetName');

  // Check if required form fields are filled
  const isFormValid = firstName?.trim() && 
                     lastName?.trim() && 
                     dateOfBirth?.trim() && 
                     gender?.trim() && 
                     contactNumber?.trim() &&
                     (houseNumber?.trim() || streetName?.trim());

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data);
    reset(); // Reset form after successful submission
  });

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      {/* Two-column layout matching legacy design */}
      <Grid gutter="xl" style={{ marginBottom: '30px' }}>
        
        {/* Left Column - Patient Information */}
        <Grid.Col span={6}>
          <Box>
            <Title 
              order={3}
              style={{
                marginBottom: '20px',
                color: '#004f6e',
                fontSize: '18px',
                fontWeight: 'bold',
                borderBottom: '2px solid #4db6ac',
                paddingBottom: '8px'
              }}
            >
              PATIENT'S INFORMATION
            </Title>
            
            <Stack gap="md">
              {/* Name fields in one row */}
              <Grid gutter="md">
                <Grid.Col span={4}>
                  <FormTextInput
                    label="Last Name"
                    placeholder="Enter last name"
                    error={errors.lastName}
                    disabled={isLoading}
                    required
                    {...register('lastName')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FormTextInput
                    label="First Name"
                    placeholder="Enter first name"
                    error={errors.firstName}
                    disabled={isLoading}
                    required
                    {...register('firstName')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FormTextInput
                    label="Middle Name"
                    placeholder="Enter middle name"
                    error={errors.middleName}
                    disabled={isLoading}
                    {...register('middleName')}
                  />
                </Grid.Col>
              </Grid>

              {/* DOB, Age, Gender, Contact row */}
              <Grid gutter="md">
                <Grid.Col span={3}>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field, fieldState }) => (
                      <DateInput
                        label="Date of Birth"
                        placeholder="Pick date"
                        error={fieldState.error?.message}
                        valueFormat="YYYY-MM-DD"
                        disabled={isLoading}
                        required
                        {...field}
                        value={field.value ? new Date(field.value) : null}
                        onChange={(date: Date | null) => {
                          field.onChange(date ? date.toISOString().split('T')[0] : '');
                        }}
                      />
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  <FormTextInput
                    label="Age"
                    placeholder="Age"
                    disabled={true}
                    value={dateOfBirth ? Math.floor((new Date().getTime() - new Date(dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)).toString() : ''}
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Select
                        label="Gender"
                        placeholder="Select gender"
                        error={fieldState.error?.message}
                        data={GENDER_OPTIONS}
                        disabled={isLoading}
                        required
                        {...field}
                      />
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FormTextInput
                    label="Contact Number"
                    placeholder="09278479061"
                    error={errors.contactNumber}
                    maxLength={11}
                    disabled={isLoading}
                    required
                    {...register('contactNumber')}
                  />
                </Grid.Col>
              </Grid>

              {/* Address Details */}
              <Box>
                <Title order={5} style={{ marginBottom: '10px', color: '#333' }}>
                  Address Details:
                </Title>
                
                <Stack gap="sm">
                  <Grid gutter="md">
                    <Grid.Col span={6}>
                      <FormTextInput
                        label="House No."
                        placeholder="e.g., 123"
                        error={errors.houseNumber}
                        disabled={isLoading}
                        {...register('houseNumber')}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <FormTextInput
                        label="Street Name"
                        placeholder="e.g., Rizal Street"
                        error={errors.streetName}
                        disabled={isLoading}
                        {...register('streetName')}
                      />
                    </Grid.Col>
                  </Grid>

                  <Grid gutter="md">
                    <Grid.Col span={6}>
                      <Controller
                        name="province"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Select
                            label="Province"
                            placeholder="Select Province"
                            error={fieldState.error?.message}
                            data={PROVINCES}
                            disabled={isLoading}
                            searchable
                            {...field}
                          />
                        )}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Controller
                        name="cityMunicipality"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Select
                            label="City/Municipality"
                            placeholder="Select city first"
                            error={fieldState.error?.message}
                            data={CITIES}
                            disabled={isLoading}
                            searchable
                            {...field}
                          />
                        )}
                      />
                    </Grid.Col>
                  </Grid>

                  <Controller
                    name="barangay"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Select
                        label="Barangay"
                        placeholder="Select city first"
                        error={fieldState.error?.message}
                        data={BARANGAYS}
                        disabled={isLoading}
                        searchable
                        {...field}
                      />
                    )}
                  />
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Grid.Col>

        {/* Right Column - Guardian Information */}
        <Grid.Col span={6}>
          <Box>
            <Title 
              order={3}
              style={{
                marginBottom: '20px',
                color: '#004f6e',
                fontSize: '18px',
                fontWeight: 'bold',
                borderBottom: '2px solid #4db6ac',
                paddingBottom: '8px'
              }}
            >
              GUARDIAN INFORMATION
            </Title>
            
            <Stack gap="md">
              <FormTextInput
                label="Full Name"
                placeholder="Enter guardian full name"
                error={errors.guardianName}
                disabled={isLoading}
                {...register('guardianName')}
              />

              <Grid gutter="md">
                <Grid.Col span={4}>
                  <Controller
                    name="guardianGender"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Select
                        label="Gender"
                        placeholder="Select gender"
                        error={fieldState.error?.message}
                        data={GENDER_OPTIONS}
                        disabled={isLoading}
                        {...field}
                      />
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FormTextInput
                    label="Relationship"
                    placeholder="Enter relationship"
                    error={errors.guardianRelationship}
                    disabled={isLoading}
                    {...register('guardianRelationship')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FormTextInput
                    label="Contact Number"
                    placeholder="09278479061"
                    error={errors.guardianContactNumber}
                    maxLength={11}
                    disabled={isLoading}
                    {...register('guardianContactNumber')}
                  />
                </Grid.Col>
              </Grid>

              {/* Guardian Address Details */}
              <Box>
                <Title order={5} style={{ marginBottom: '10px', color: '#333' }}>
                  Guardian Address Details:
                </Title>
                
                <Stack gap="sm">
                  <Grid gutter="md">
                    <Grid.Col span={6}>
                      <FormTextInput
                        label="House No."
                        placeholder="e.g., 123"
                        error={errors.guardianHouseNumber}
                        disabled={isLoading}
                        {...register('guardianHouseNumber')}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <FormTextInput
                        label="Street Name"
                        placeholder="e.g., Rizal Street"
                        error={errors.guardianStreetName}
                        disabled={isLoading}
                        {...register('guardianStreetName')}
                      />
                    </Grid.Col>
                  </Grid>

                  <Grid gutter="md">
                    <Grid.Col span={6}>
                      <Controller
                        name="guardianProvince"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Select
                            label="Province"
                            placeholder="Select Province"
                            error={fieldState.error?.message}
                            data={PROVINCES}
                            disabled={isLoading}
                            searchable
                            {...field}
                          />
                        )}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Controller
                        name="guardianCityMunicipality"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Select
                            label="City/Municipality"
                            placeholder="Select city first"
                            error={fieldState.error?.message}
                            data={CITIES}
                            disabled={isLoading}
                            searchable
                            {...field}
                          />
                        )}
                      />
                    </Grid.Col>
                  </Grid>

                  <Controller
                    name="guardianBarangay"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Select
                        label="Barangay"
                        placeholder="Select city first"
                        error={fieldState.error?.message}
                        data={BARANGAYS}
                        disabled={isLoading}
                        searchable
                        {...field}
                      />
                    )}
                  />
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Grid.Col>
      </Grid>

      {/* Form Actions */}
      <Box
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '15px',
          paddingTop: '20px',
          borderTop: '1px solid #e9ecef',
        }}
      >
        <Button
          variant="outline"
          color="gray"
          onClick={onCancel}
          disabled={isLoading}
          leftSection={<span>✕</span>}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!isFormValid || isLoading}
          loading={isLoading}
          leftSection={<span>💾</span>}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </form>
  );
};