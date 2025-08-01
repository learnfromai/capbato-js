import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePatientDetailsViewModel } from './usePatientDetailsViewModel';

// Mock the mock data
const mockPatientDetails = {
  id: '1',
  patientNumber: 'P001',
  firstName: 'Maria',
  lastName: 'Santos',
  fullName: 'Maria Santos',
  dateOfBirth: '1990-05-15',
  age: 34,
  gender: 'Female' as const,
  phoneNumber: '+63 912 345 6789',
  email: 'maria.santos@email.com',
  address: {
    street: '123 Rizal Street',
    city: 'Quezon City',
    province: 'Metro Manila',
    zipCode: '1100'
  },
  emergencyContact: {
    name: 'Juan Santos',
    relationship: 'Husband',
    phoneNumber: '+63 917 123 4567'
  },
  medicalHistory: ['Hypertension', 'Diabetes Type 2'],
  allergies: ['Penicillin'],
  bloodType: 'O+',
  createdAt: '2024-01-15T09:00:00.000Z',
  updatedAt: '2024-12-15T14:30:00.000Z',
  guardian: {
    fullName: 'Roberto Santos',
    gender: 'Male' as const,
    relationship: 'Father',
    contactNumber: '9171234567',
    address: '123 Rizal Street, Quezon City'
  },
  appointments: [
    {
      id: '1-apt1',
      date: '2025-06-29',
      time: '11:00',
      reasonForVisit: 'Consultation',
      labTestsDone: 'N/A',
      prescriptions: 'N/A',
      status: 'Confirmed' as const
    }
  ]
};

vi.mock('../../../data/mockPatients', () => ({
  getPatientDetailsById: vi.fn((id: string) => {
    if (id === '1') return mockPatientDetails;
    return undefined;
  })
}));

describe('usePatientDetailsViewModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => usePatientDetailsViewModel('1'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.patient).toBeUndefined();
    expect(result.current.error).toBe(null);
    expect(result.current.hasPatient).toBe(false);
    expect(result.current.hasError).toBe(false);
  });

  it('should load patient details successfully', async () => {
    const { result } = renderHook(() => usePatientDetailsViewModel('1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.patient).toEqual(mockPatientDetails);
    expect(result.current.error).toBe(null);
    expect(result.current.hasPatient).toBe(true);
    expect(result.current.hasError).toBe(false);
  });

  it('should handle patient not found', async () => {
    const { result } = renderHook(() => usePatientDetailsViewModel('999'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.patient).toBeUndefined();
    expect(result.current.error).toBe('Patient with ID "999" not found');
    expect(result.current.hasPatient).toBe(false);
    expect(result.current.hasError).toBe(true);
  });

  it('should handle missing patient ID', async () => {
    const { result } = renderHook(() => usePatientDetailsViewModel(undefined));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.patient).toBeUndefined();
    expect(result.current.error).toBe('Patient ID is required');
    expect(result.current.hasPatient).toBe(false);
    expect(result.current.hasError).toBe(true);
  });

  it('should clear error', async () => {
    const { result } = renderHook(() => usePatientDetailsViewModel(undefined));

    await waitFor(() => {
      expect(result.current.hasError).toBe(true);
    });

    result.current.clearError();

    expect(result.current.error).toBe(null);
    expect(result.current.hasError).toBe(false);
  });

  it('should refresh patient details', async () => {
    const { result } = renderHook(() => usePatientDetailsViewModel('1'));

    await waitFor(() => {
      expect(result.current.hasPatient).toBe(true);
    });

    result.current.refreshPatientDetails();

    expect(result.current.patient).toEqual(mockPatientDetails);
  });

  it('should reload patient details when patientId changes', async () => {
    const { result, rerender } = renderHook(
      ({ patientId }) => usePatientDetailsViewModel(patientId),
      { initialProps: { patientId: '1' } }
    );

    await waitFor(() => {
      expect(result.current.hasPatient).toBe(true);
    });

    expect(result.current.patient?.id).toBe('1');

    // Change patient ID
    rerender({ patientId: '999' });

    await waitFor(() => {
      expect(result.current.hasError).toBe(true);
    });

    expect(result.current.error).toBe('Patient with ID "999" not found');
  });
});