import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Text, Alert } from '@mantine/core';
import { AddPatientForm } from '../components/AddPatientForm';
import { useAddPatientViewModel } from '../view-models/useAddPatientViewModel';
import { MedicalClinicLayout } from '../../../components/layout';
import { Icon } from '../../../components/common';

/**
 * AddPatientPage component for creating new patient records
 * Provides a form interface with proper navigation and error handling
 */
export const AddPatientPage: React.FC = () => {
  const navigate = useNavigate();
  const { createPatient, isLoading, error, successMessage, clearMessages } = useAddPatientViewModel();

  // Navigate back to patients page after successful creation
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        navigate('/patients');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  const handleSubmit = async (data: any) => {
    const patient = await createPatient(data);
    // Navigation is handled in useEffect above if successful
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
        }}
      >
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
          <Box style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Button
              variant="outline"
              color="gray"
              onClick={handleCancel}
              leftSection={<Icon icon="fas fa-arrow-left" />}
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
              }}
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
          </Box>
        </Box>

        {/* Success Message */}
        {successMessage && (
          <Alert color="green" mb="lg" onClose={clearMessages}>
            <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon icon="fas fa-check-circle" />
              {successMessage}
            </Box>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert color="red" mb="lg" onClose={clearMessages}>
            <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon icon="fas fa-exclamation-circle" />
              {error}
            </Box>
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