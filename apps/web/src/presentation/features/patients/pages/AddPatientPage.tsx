import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Group, Text, LoadingOverlay, Alert } from '@mantine/core';
import { MedicalClinicLayout } from '../../../components/layout';
import { AddPatientForm } from '../components';
import { CreatePatientCommand } from '@nx-starter/application-shared';
import { Icon } from '../../../components/common';

export const AddPatientPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (data: CreatePatientCommand) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Implement patient creation via API service
      console.log('Creating patient:', data);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to patients list after successful creation
      navigate('/patients');
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to create patient. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/patients');
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <MedicalClinicLayout>
      <Box
        style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          minHeight: 'calc(100vh - 140px)',
          position: 'relative'
        }}
      >
        <LoadingOverlay visible={isLoading} />
        
        {/* Page Header */}
        <Group justify="space-between" align="center" mb="xl" pb="lg" style={{ borderBottom: '2px solid #e9ecef' }}>
          <Group gap="lg">
            <Button
              variant="filled"
              color="gray"
              onClick={handleCancel}
              leftSection={<Icon icon="fas fa-arrow-left" />}
              disabled={isLoading}
            >
              Back to Patients
            </Button>
            
            <Text 
              size="xl" 
              fw={700} 
              c="#333"
              style={{ fontSize: '32px' }}
            >
              Add New Patient
            </Text>
          </Group>
        </Group>

        {/* Error Alert */}
        {error && (
          <Alert 
            color="red" 
            title="Error"
            mb="md"
            withCloseButton
            onClose={clearError}
          >
            {error}
          </Alert>
        )}

        {/* Add Patient Form */}
        <AddPatientForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </Box>
    </MedicalClinicLayout>
  );
};