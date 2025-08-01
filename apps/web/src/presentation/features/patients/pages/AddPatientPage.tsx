import React, { useState } from 'react';
import { Box, Alert } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { MedicalClinicLayout } from '../../../components/layout';
import { AddPatientForm } from '../components';
import type { CreatePatientCommand } from '@nx-starter/application-shared';

export const AddPatientPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreatePatientCommand) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement patient creation when API service is available
      console.log('Creating patient with data:', data);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to patients list on success
      navigate('/patients');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create patient';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
        <AddPatientForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          error={error}
        />
      </Box>
    </MedicalClinicLayout>
  );
};