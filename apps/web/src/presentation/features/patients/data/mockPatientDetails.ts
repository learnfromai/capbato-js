import { PatientDetails } from '../types';

export const mockPatientDetails: PatientDetails = {
  id: '2025-A1',
  patientNumber: '2025-A1',
  firstName: 'Lilienne',
  lastName: 'Altamirano Alleje',
  fullName: 'Lilienne Altamirano Alleje',
  dateOfBirth: '2025-03-02',
  age: 123,
  gender: 'Male',
  phoneNumber: '2147483647',
  email: 'patient@example.com',
  address: {
    street: 'Ph 4 Pkg 5 Blk 34 Lot 17',
    city: 'Sample City',
    province: 'Sample Province',
    zipCode: '1234'
  },
  emergencyContact: {
    name: 'Anjela Depanes',
    relationship: 'Aaa',
    phoneNumber: '9083421788'
  },
  medicalHistory: ['No significant medical history'],
  allergies: ['None known'],
  bloodType: 'O+',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  guardian: {
    fullName: 'Anjela Depanes',
    gender: 'Male',
    relationship: 'Aaa',
    phoneNumber: '9083421788',
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
  ]
};