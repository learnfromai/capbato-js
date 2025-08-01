import { useState, useCallback } from 'react';
import { usePatientStore } from '../../../../infrastructure/state/PatientStore';
import { CreatePatientCommand, PatientDto } from '@nx-starter/application-shared';

export interface AddPatientData extends CreatePatientCommand {}

/**
 * Add Patient View Model for handling patient creation
 * Handles form submission and integration with the patient store
 */
export const useAddPatientViewModel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const patientStore = usePatientStore();

  const createPatient = useCallback(async (data: AddPatientData): Promise<PatientDto | null> => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const createdPatient = await patientStore.createPatient(data);
      
      setSuccessMessage(`Patient ${createdPatient.firstName} ${createdPatient.lastName} has been successfully created.`);
      return createdPatient;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create patient';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [patientStore]);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  return {
    createPatient,
    isLoading,
    error,
    successMessage,
    clearMessages,
  };
};