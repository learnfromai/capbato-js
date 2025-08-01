import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, LoadingOverlay, Alert, Group, Button, Text } from '@mantine/core';
import { MedicalClinicLayout } from '../../../components/layout';
import { AddPatientForm } from '../components';
import { usePatientStore } from '../../../../infrastructure/state/PatientStore';
import { CreatePatientCommand } from '@nx-starter/application-shared';
import { Icon } from '../../../components/common';

export const AddPatientPage: React.FC = () => {
  const navigate = useNavigate();
  const { createPatient, getIsCreatingPatient, error, clearError } = usePatientStore();

  const handleSubmit = async (data: CreatePatientCommand) => {
    try {
      await createPatient(data);
      // Navigate back to patients list after successful creation
      navigate('/patients');
    } catch (error) {
      // Error is handled by the store and will be displayed
      console.error('Failed to create patient:', error);
    }
  };

  const handleCancel = () => {
    navigate('/patients');
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
        <LoadingOverlay visible={getIsCreatingPatient()} />
        
        {/* Page Header */}
        <Group justify="space-between" align="center" mb="xl" pb="md" style={{ borderBottom: '2px solid #e9ecef' }}>
          <Group gap="md">
            <Button
              variant="outline"
              color="gray"
              onClick={handleCancel}
              leftSection={<Icon icon="fas fa-arrow-left" />}
            >
              Back to Patients
            </Button>
            
            <Text size="xl" fw={700} c="#333">
              Add New Patient
            </Text>
          </Group>
        </Group>
        
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
          isLoading={getIsCreatingPatient()}
        />
      </Box>
    </MedicalClinicLayout>
  );
};