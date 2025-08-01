import React from 'react';
import { Box, LoadingOverlay, Alert, Button, Group, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { MedicalClinicLayout } from '../../../components/layout';
import { AddPatientForm } from '../components';
import { usePatientStore } from '../../../../infrastructure/state/PatientStore';
import type { CreatePatientCommand } from '@nx-starter/application-shared';

export const AddPatientPage: React.FC = () => {
  const navigate = useNavigate();
  const { createPatient, getIsCreating, createError, clearCreateError } = usePatientStore();

  const handleBackToPatients = () => {
    navigate('/patients');
  };

  const handleSubmit = async (data: CreatePatientCommand) => {
    const success = await createPatient(data);
    if (success) {
      // Navigate back to patients page on success
      navigate('/patients');
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
        <LoadingOverlay visible={getIsCreating()} />
        
        {/* Page Header */}
        <Box
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: '2px solid #e9ecef',
          }}
        >
          <Group gap="lg">
            <Button
              variant="outline"
              color="gray"
              onClick={handleBackToPatients}
              leftSection={<span>←</span>}
            >
              Back to Patients
            </Button>
            <Title
              order={2}
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#333',
                margin: 0,
              }}
            >
              Add New Patient
            </Title>
          </Group>
        </Box>
        
        {createError && (
          <Alert 
            color="red" 
            title="Error"
            mb="md"
            withCloseButton
            onClose={clearCreateError}
          >
            {createError}
          </Alert>
        )}
        
        <AddPatientForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={getIsCreating()}
        />
      </Box>
    </MedicalClinicLayout>
  );
};