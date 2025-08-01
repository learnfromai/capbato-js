import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, LoadingOverlay, Alert, Button, Group, Text } from '@mantine/core';
import { MedicalClinicLayout } from '../../../components/layout';
import { AddPatientForm } from '../components';
import { CreatePatientCommand } from '@nx-starter/application-shared';
import { Icon } from '../../../components/common';

export const AddPatientPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (data: CreatePatientCommand) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Submitting patient data:', data);
      // TODO: Implement actual patient creation API call
      // await createPatient(data);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to patients list on success
      navigate('/patients');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create patient');
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
        <Box
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: '2px solid #e9ecef'
          }}
        >
          <Group gap="lg">
            <Button
              variant="filled"
              color="gray"
              onClick={handleCancel}
              style={{
                background: '#6c757d',
                '&:hover': {
                  background: '#5a6268',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              <Icon icon="fas fa-arrow-left" style={{ marginRight: '8px' }} />
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
        </Box>
        
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
        
        <AddPatientForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </Box>
    </MedicalClinicLayout>
  );
};