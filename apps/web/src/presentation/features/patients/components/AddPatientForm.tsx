import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button,
  Select,
  Stack,
  Grid,
  Text,
  Divider,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { CreatePatientCommandSchema, CreatePatientCommand } from '@nx-starter/application-shared';
import { FormTextInput } from '../../../components/ui/FormTextInput';
import { Icon } from '../../../components/common';

interface AddPatientFormProps {
  onSubmit: (data: CreatePatientCommand) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

/**
 * AddPatientForm component handles the creation of new patient records
 * with comprehensive validation and proper TypeScript typing.
 * Follows the legacy UI layout with two-column structure.
 */
export const AddPatientForm: React.FC<AddPatientFormProps> = ({
  onSubmit,
  onCancel,
  isLoading
}) => {
  // React Hook Form setup
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
      gender: undefined,
      contactNumber: '',
      houseNumber: '',
      streetName: '',
      province: '',
      cityMunicipality: '',
      barangay: '',
      guardianName: '',
      guardianGender: undefined,
      guardianRelationship: '',
      guardianContactNumber: '',
      guardianHouseNumber: '',
      guardianStreetName: '',
      guardianProvince: '',
      guardianCityMunicipality: '',
      guardianBarangay: '',
    },
  });

  // Watch required fields for button state
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const dateOfBirth = watch('dateOfBirth');
  const gender = watch('gender');
  const contactNumber = watch('contactNumber');

  // Check if required form fields are empty
  const isFormEmpty = !firstName?.trim() || 
                     !lastName?.trim() || 
                     !dateOfBirth || 
                     !gender || 
                     !contactNumber?.trim();

  const handleFormSubmit = handleSubmit(async (data: CreatePatientCommand) => {
    await onSubmit(data);
    reset(); // Reset form after successful submission
  });

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      <Grid gutter="xl" grow>
        {/* Patient's Information - Left Column */}
        <Grid.Col span={6}>
          <Stack gap="md">
            <Text size="lg" fw={700} c="#004f6e" pb="xs" style={{ borderBottom: '2px solid #4db6ac' }}>
              PATIENT'S INFORMATION
            </Text>
            
            {/* Name Fields Row */}
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

            {/* Personal Details Row */}
            <Grid gutter="md">
              <Grid.Col span={3}>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DateInput
                      label="Date of Birth"
                      placeholder="mm/dd/yyyy"
                      error={fieldState.error?.message}
                      disabled={isLoading}
                      required
                      value={field.value ? new Date(field.value) : null}
                      onChange={(value) => field.onChange(value ? value.toISOString().split('T')[0] : '')}
                      valueFormat="MM/DD/YYYY"
                      rightSection={<Icon icon="fas fa-calendar" size={14} />}
                    />
                  )}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <FormTextInput
                  label="Age"
                  placeholder="Age"
                  type="number"
                  disabled={true}
                  value=""
                  readOnly
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select
                      label="Gender"
                      placeholder="Select"
                      error={fieldState.error?.message}
                      data={[
                        { value: 'Male', label: 'Male' },
                        { value: 'Female', label: 'Female' }
                      ]}
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
            <Text size="sm" fw={500} c="#333" mt="md">
              Address Details:
            </Text>
            
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
                <FormTextInput
                  label="Province"
                  placeholder="Select Province"
                  error={errors.province}
                  disabled={isLoading}
                  {...register('province')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <FormTextInput
                  label="City/Municipality"
                  placeholder="Select city first"
                  error={errors.cityMunicipality}
                  disabled={isLoading}
                  {...register('cityMunicipality')}
                />
              </Grid.Col>
            </Grid>

            <FormTextInput
              label="Barangay"
              placeholder="Select city first"
              error={errors.barangay}
              disabled={isLoading}
              {...register('barangay')}
            />
          </Stack>
        </Grid.Col>

        {/* Guardian Information - Right Column */}
        <Grid.Col span={6}>
          <Stack gap="md">
            <Text size="lg" fw={700} c="#004f6e" pb="xs" style={{ borderBottom: '2px solid #4db6ac' }}>
              GUARDIAN INFORMATION
            </Text>

            <FormTextInput
              label="Full Name"
              placeholder="Enter guardian's full name"
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
                      placeholder="Select"
                      error={fieldState.error?.message}
                      data={[
                        { value: 'Male', label: 'Male' },
                        { value: 'Female', label: 'Female' }
                      ]}
                      disabled={isLoading}
                      {...field}
                    />
                  )}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <FormTextInput
                  label="Relationship"
                  placeholder="e.g., Father, Mother"
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
            <Text size="sm" fw={500} c="#333" mt="md">
              Guardian Address Details:
            </Text>
            
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
                <FormTextInput
                  label="Province"
                  placeholder="Select Province"
                  error={errors.guardianProvince}
                  disabled={isLoading}
                  {...register('guardianProvince')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <FormTextInput
                  label="City/Municipality"
                  placeholder="Select city first"
                  error={errors.guardianCityMunicipality}
                  disabled={isLoading}
                  {...register('guardianCityMunicipality')}
                />
              </Grid.Col>
            </Grid>

            <FormTextInput
              label="Barangay"
              placeholder="Select city first"
              error={errors.guardianBarangay}
              disabled={isLoading}
              {...register('guardianBarangay')}
            />
          </Stack>
        </Grid.Col>
      </Grid>

      <Divider my="xl" />

      {/* Form Actions */}
      <Stack gap="md" align="flex-end">
        <Grid gutter="md">
          <Grid.Col span="auto">
            <Button
              variant="outline"
              color="gray"
              onClick={onCancel}
              disabled={isLoading}
              leftSection={<Icon icon="fas fa-times" />}
            >
              Cancel
            </Button>
          </Grid.Col>
          <Grid.Col span="auto">
            <Button
              type="submit"
              disabled={isFormEmpty || isLoading}
              loading={isLoading}
              leftSection={<Icon icon="fas fa-save" />}
            >
              {isLoading ? 'Creating Patient...' : 'Submit'}
            </Button>
          </Grid.Col>
        </Grid>
      </Stack>
    </form>
  );
};