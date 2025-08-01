import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button,
  Select,
  Stack,
  Group,
  Grid,
  Box,
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
 * AddPatientForm component with two-column layout matching legacy design
 * Uses Mantine components with React Hook Form and Zod validation
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

  // Watch form values for button state
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const dateOfBirth = watch('dateOfBirth');
  const gender = watch('gender');
  const contactNumber = watch('contactNumber');

  // Check if required form fields are empty
  const isFormEmpty = !firstName?.trim() || 
                     !lastName?.trim() || 
                     !dateOfBirth?.trim() || 
                     !gender?.trim() ||
                     !contactNumber?.trim();

  const handleFormSubmit = handleSubmit(async (data: CreatePatientCommand) => {
    await onSubmit(data);
    reset(); // Reset form after successful submission
  });

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      <Stack gap="lg">
        {/* Two-column layout like legacy */}
        <Grid>
          {/* Patient Information Section */}
          <Grid.Col span={6}>
            <Box>
              <Text 
                size="lg" 
                fw={700} 
                c="#004f6e" 
                mb="md"
                style={{ borderBottom: '2px solid #4db6ac', paddingBottom: '8px' }}
              >
                PATIENT'S INFORMATION
              </Text>
              
              {/* Name fields in one row */}
              <Group grow mb="md">
                <FormTextInput
                  label="Last Name"
                  placeholder="Enter last name"
                  error={errors.lastName}
                  disabled={isLoading}
                  required
                  {...register('lastName')}
                />
                
                <FormTextInput
                  label="First Name"
                  placeholder="Enter first name"
                  error={errors.firstName}
                  disabled={isLoading}
                  required
                  {...register('firstName')}
                />
                
                <FormTextInput
                  label="Middle Name"
                  placeholder="Enter middle name"
                  error={errors.middleName}
                  disabled={isLoading}
                  {...register('middleName')}
                />
              </Group>

              {/* Date, Age, Gender, Contact in one row */}
              <Group grow mb="md">
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DateInput
                      label="Date of Birth"
                      placeholder="mm/dd/yyyy"
                      error={fieldState.error?.message}
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                      valueFormat="MM/DD/YYYY"
                      disabled={isLoading}
                      required
                      clearable
                    />
                  )}
                />
                
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
                
                <FormTextInput
                  label="Contact Number"
                  placeholder="09278479061"
                  error={errors.contactNumber}
                  maxLength={11}
                  disabled={isLoading}
                  required
                  {...register('contactNumber')}
                />
              </Group>

              {/* Address Details */}
              <Text fw={600} mb="sm" c="#333">Address Details:</Text>
              
              <Group grow mb="md">
                <FormTextInput
                  label="House No."
                  placeholder="e.g., 123"
                  error={errors.houseNumber}
                  disabled={isLoading}
                  {...register('houseNumber')}
                />
                
                <FormTextInput
                  label="Street Name"
                  placeholder="e.g., Rizal Street"
                  error={errors.streetName}
                  disabled={isLoading}
                  {...register('streetName')}
                />
              </Group>

              <Group grow mb="md">
                <FormTextInput
                  label="Province"
                  placeholder="Select province"
                  error={errors.province}
                  disabled={isLoading}
                  {...register('province')}
                />
                
                <FormTextInput
                  label="City/Municipality"
                  placeholder="Select city"
                  error={errors.cityMunicipality}
                  disabled={isLoading}
                  {...register('cityMunicipality')}
                />
              </Group>

              <FormTextInput
                label="Barangay"
                placeholder="Select barangay"
                error={errors.barangay}
                disabled={isLoading}
                {...register('barangay')}
              />
            </Box>
          </Grid.Col>

          {/* Guardian Information Section */}
          <Grid.Col span={6}>
            <Box>
              <Text 
                size="lg" 
                fw={700} 
                c="#004f6e" 
                mb="md"
                style={{ borderBottom: '2px solid #4db6ac', paddingBottom: '8px' }}
              >
                GUARDIAN INFORMATION
              </Text>
              
              <FormTextInput
                label="Full Name"
                placeholder="Enter guardian name"
                error={errors.guardianName}
                disabled={isLoading}
                mb="md"
                {...register('guardianName')}
              />

              <Group grow mb="md">
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
                
                <FormTextInput
                  label="Relationship"
                  placeholder="Enter relationship"
                  error={errors.guardianRelationship}
                  disabled={isLoading}
                  {...register('guardianRelationship')}
                />
                
                <FormTextInput
                  label="Contact Number"
                  placeholder="09278479061"
                  error={errors.guardianContactNumber}
                  maxLength={11}
                  disabled={isLoading}
                  {...register('guardianContactNumber')}
                />
              </Group>

              {/* Guardian Address Details */}
              <Text fw={600} mb="sm" c="#333">Guardian Address Details:</Text>
              
              <Group grow mb="md">
                <FormTextInput
                  label="House No."
                  placeholder="e.g., 123"
                  error={errors.guardianHouseNumber}
                  disabled={isLoading}
                  {...register('guardianHouseNumber')}
                />
                
                <FormTextInput
                  label="Street Name"
                  placeholder="e.g., Rizal Street"
                  error={errors.guardianStreetName}
                  disabled={isLoading}
                  {...register('guardianStreetName')}
                />
              </Group>

              <Group grow mb="md">
                <FormTextInput
                  label="Province"
                  placeholder="Select province"
                  error={errors.guardianProvince}
                  disabled={isLoading}
                  {...register('guardianProvince')}
                />
                
                <FormTextInput
                  label="City/Municipality"
                  placeholder="Select city"
                  error={errors.guardianCityMunicipality}
                  disabled={isLoading}
                  {...register('guardianCityMunicipality')}
                />
              </Group>

              <FormTextInput
                label="Barangay"
                placeholder="Select barangay"
                error={errors.guardianBarangay}
                disabled={isLoading}
                {...register('guardianBarangay')}
              />
            </Box>
          </Grid.Col>
        </Grid>

        {/* Form Actions */}
        <Divider mt="xl" />
        <Group justify="flex-end" pt="md">
          <Button
            variant="outline"
            color="gray"
            disabled={isLoading}
            onClick={onCancel}
            leftSection={<Icon icon="fas fa-times" />}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            disabled={isFormEmpty || isLoading}
            loading={isLoading}
            leftSection={<Icon icon="fas fa-save" />}
            style={{ backgroundColor: '#17A589' }}
          >
            {isLoading ? 'Creating Patient...' : 'Submit'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};