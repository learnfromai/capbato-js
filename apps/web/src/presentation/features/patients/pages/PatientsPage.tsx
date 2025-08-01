import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, LoadingOverlay, Alert, Button } from '@mantine/core';
import { MedicalClinicLayout } from '../../../components/layout';
import { PatientsTable } from '../components';
import { usePatientViewModel } from '../view-models';

export const PatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const { patients, isLoading, error, clearError } = usePatientViewModel();

  const handleAddPatient = () => {
    navigate('/patients/add');
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
        
        <PatientsTable
          patients={patients}
          onAddPatient={handleAddPatient}
        />
      </Box>
    </MedicalClinicLayout>
  );
};
