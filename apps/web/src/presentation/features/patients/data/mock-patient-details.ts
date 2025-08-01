import { PatientDetailsData } from '../types/patient-details.types';

// Mock data based on the legacy UI example
export const mockPatientDetailsData: PatientDetailsData = {
  patient: {
    id: '1',
    patientNumber: '2025-A1',
    fullName: 'Lilienne Altamirano Alleje',
    gender: 'Male',
    age: 123,
    dateOfBirth: 'March 2, 2025',
    contactNumber: '2147483647',
    address: 'Ph 4 Pkg 5 Blk 34 Lot 17'
  },
  guardian: {
    fullName: 'Anjela Depanes',
    gender: 'Male',
    relationship: 'Aaa',
    contactNumber: '9083421788',
    address: 'Ph 4 Pkg 5 Blk 34 Lot 17'
  },
  appointments: [
    {
      id: '1',
      date: 'June 29, 2025',
      time: '11:00 AM',
      reasonForVisit: 'Consultation',
      labTestsDone: 'N/A',
      prescriptions: 'N/A',
      status: 'Confirmed'
    },
    {
      id: '2',
      date: 'May 21, 2025',
      time: '8:00 AM',
      reasonForVisit: 'Consultation',
      labTestsDone: 'N/A',
      prescriptions: 'N/A',
      status: 'Confirmed'
    },
    {
      id: '3',
      date: 'May 20, 2025',
      time: '8:00 AM',
      reasonForVisit: 'Consultation',
      labTestsDone: 'N/A',
      prescriptions: 'N/A',
      status: 'Confirmed'
    }
  ],
  medicalRecords: [
    {
      id: '1',
      date: 'June 29, 2025',
      diagnosis: 'Routine Check-up',
      treatment: 'General consultation',
      notes: 'Patient in good health'
    },
    {
      id: '2',
      date: 'May 21, 2025',
      diagnosis: 'Follow-up',
      treatment: 'Medication review',
      notes: 'Continued treatment plan'
    }
  ],
  prescriptions: [
    {
      id: '1',
      date: 'June 29, 2025',
      medication: 'Paracetamol',
      dosage: '500mg',
      instructions: 'Take twice daily after meals',
      prescribedBy: 'Dr. Smith'
    },
    {
      id: '2',
      date: 'May 21, 2025',
      medication: 'Vitamin D',
      dosage: '1000 IU',
      instructions: 'Take once daily',
      prescribedBy: 'Dr. Smith'
    }
  ],
  laboratoryRequests: [
    {
      id: '1',
      testType: 'Blood Test',
      requestDate: 'June 29, 2025',
      status: 'Pending'
    },
    {
      id: '2',
      testType: 'Urine Test',
      requestDate: 'May 21, 2025',
      status: 'Completed'
    },
    {
      id: '3',
      testType: 'X-Ray',
      requestDate: 'May 20, 2025',
      status: 'Completed'
    }
  ]
};

// Function to get patient details by ID (simulation)
export const getPatientDetails = (patientId: string): PatientDetailsData | null => {
  // In a real implementation, this would fetch from an API
  if (patientId === '1' || patientId === '2025-A1') {
    return mockPatientDetailsData;
  }
  return null;
};