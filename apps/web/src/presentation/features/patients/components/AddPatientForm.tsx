import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button,
  Select,
  Stack,
  Group,
  Grid,
  Text,
  Box,
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
 * AddPatientForm component handles the creation of new patients
 * with comprehensive validation and proper TypeScript typing.
 * Layout matches the legacy UI with two columns for Patient and Guardian information.
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

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      <Grid gutter="xl">
        {/* Patient Information Column */}
        <Grid.Col span={6}>
          <Box>
            <Text 
              size="lg" 
              fw={700} 
              c="#004f6e" 
              mb="md"
              style={{ 
                borderBottom: '2px solid #4db6ac',
                paddingBottom: '8px' 
              }}
            >
              PATIENT'S INFORMATION
            </Text>
            
            <Stack gap="md">
              {/* Name Fields Row */}
              <Group grow>
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

              {/* Personal Details Row */}
              <Group grow>
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
                      valueFormat="YYYY-MM-DD"
                      rightSection={<Icon icon="fas fa-calendar" size={14} />}
                      {...field}
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                    />
                  )}
                />
                
                <FormTextInput
                  label="Age"
                  placeholder="Age will be calculated"
                  disabled
                  style={{ opacity: 0.6 }}
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
              <Box>
                <Text size="sm" fw={500} mb="xs">Address Details:</Text>
                <Stack gap="sm">
                  <Group grow>
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
                  
                  <Group grow>
                    <FormTextInput
                      label="Province"
                      placeholder="Select Province"
                      error={errors.province}
                      disabled={isLoading}
                      {...register('province')}
                    />
                    
                    <FormTextInput
                      label="City/Municipality"
                      placeholder="Select province first"
                      error={errors.cityMunicipality}
                      disabled={isLoading}
                      {...register('cityMunicipality')}
                    />
                  </Group>
                  
                  <FormTextInput
                    label="Barangay"
                    placeholder="Select city first"
                    error={errors.barangay}
                    disabled={isLoading}
                    {...register('barangay')}
                  />
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Grid.Col>

        {/* Guardian Information Column */}
        <Grid.Col span={6}>
          <Box>
            <Text 
              size="lg" 
              fw={700} 
              c="#004f6e" 
              mb="md"
              style={{ 
                borderBottom: '2px solid #4db6ac',
                paddingBottom: '8px' 
              }}
            >
              GUARDIAN INFORMATION
            </Text>
            
            <Stack gap="md">
              <FormTextInput
                label="Full Name"
                placeholder="Enter guardian full name"
                error={errors.guardianName}
                disabled={isLoading}
                {...register('guardianName')}
              />

              <Group grow>
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
              <Box>
                <Text size="sm" fw={500} mb="xs">Guardian Address Details:</Text>
                <Stack gap="sm">
                  <Group grow>
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
                  
                  <Group grow>
                    <FormTextInput
                      label="Province"
                      placeholder="Select Province"
                      error={errors.guardianProvince}
                      disabled={isLoading}
                      {...register('guardianProvince')}
                    />
                    
                    <FormTextInput
                      label="City/Municipality"
                      placeholder="Select province first"
                      error={errors.guardianCityMunicipality}
                      disabled={isLoading}
                      {...register('guardianCityMunicipality')}
                    />
                  </Group>
                  
                  <FormTextInput
                    label="Barangay"
                    placeholder="Select city first"
                    error={errors.guardianBarangay}
                    disabled={isLoading}
                    {...register('guardianBarangay')}
                  />
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Grid.Col>
      </Grid>

      {/* Form Actions */}
      <Divider my="xl" />
      
      <Group justify="flex-end" gap="md">
        <Button
          variant="filled"
          color="gray"
          onClick={handleCancel}
          disabled={isLoading}
          leftSection={<Icon icon="fas fa-times" />}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          disabled={isFormEmpty || isLoading}
          loading={isLoading}
          leftSection={<Icon icon="fas fa-save" />}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </Group>
    </form>
  );
};