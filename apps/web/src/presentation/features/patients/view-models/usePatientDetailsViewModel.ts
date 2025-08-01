import { useEffect, useState } from 'react';
import { getPatientDetailsById } from '../../../data/mockPatients';
import { PatientDetails } from '../types';

/**
 * Patient Details View Model
 * Handles state management for individual patient details page
 * Currently uses mock data, can be extended to use API services
 */
export const usePatientDetailsViewModel = (patientId: string | undefined) => {
  const [patient, setPatient] = useState<PatientDetails | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPatientDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!patientId) {
          throw new Error('Patient ID is required');
        }

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const patientDetails = getPatientDetailsById(patientId);
        
        if (!patientDetails) {
          throw new Error(`Patient with ID "${patientId}" not found`);
        }

        setPatient(patientDetails);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load patient details';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadPatientDetails();
  }, [patientId]);

  const clearError = () => {
    setError(null);
  };

  const refreshPatientDetails = () => {
    if (patientId) {
      const updatedPatient = getPatientDetailsById(patientId);
      setPatient(updatedPatient);
    }
  };

  return {
    patient,
    isLoading,
    error,
    clearError,
    refreshPatientDetails,
    hasPatient: !!patient,
    hasError: !!error
  };
};