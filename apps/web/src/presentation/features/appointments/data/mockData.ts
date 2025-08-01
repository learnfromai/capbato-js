/**
 * Mock data for appointment form
 * Contains sample doctors, patients, and time slots for development and testing
 */

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  isAvailable: boolean;
}

export interface Patient {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface TimeSlot {
  value: string; // 24-hour format HH:MM
  label: string; // 12-hour format display
  isAvailable: boolean;
}

// Mock doctors data
export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-001',
    firstName: 'Maria',
    lastName: 'Santos',
    specialization: 'General Medicine',
    isAvailable: true,
  },
  {
    id: 'doc-002',
    firstName: 'Juan',
    lastName: 'Cruz',
    specialization: 'Internal Medicine',
    isAvailable: true,
  },
  {
    id: 'doc-003',
    firstName: 'Ana',
    lastName: 'Reyes',
    specialization: 'Pediatrics',
    isAvailable: true,
  },
  {
    id: 'doc-004',
    firstName: 'Carlos',
    lastName: 'Garcia',
    specialization: 'Cardiology',
    isAvailable: false,
  },
  {
    id: 'doc-005',
    firstName: 'Elena',
    lastName: 'Dela Cruz',
    specialization: 'Dermatology',
    isAvailable: true,
  },
];

// Mock patients data (for autocomplete)
export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'pat-001',
    patientNumber: 'P001',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
  },
  {
    id: 'pat-002',
    patientNumber: 'P002',
    firstName: 'Jane',
    lastName: 'Smith',
    fullName: 'Jane Smith',
  },
  {
    id: 'pat-003',
    patientNumber: 'P003',
    firstName: 'Robert',
    lastName: 'Johnson',
    fullName: 'Robert Johnson',
  },
  {
    id: 'pat-004',
    patientNumber: 'P004',
    firstName: 'Mary',
    lastName: 'Brown',
    fullName: 'Mary Brown',
  },
  {
    id: 'pat-005',
    patientNumber: 'P005',
    firstName: 'David',
    lastName: 'Wilson',
    fullName: 'David Wilson',
  },
  {
    id: 'pat-006',
    patientNumber: 'P006',
    firstName: 'Sarah',
    lastName: 'Davis',
    fullName: 'Sarah Davis',
  },
  {
    id: 'pat-007',
    patientNumber: 'P007',
    firstName: 'Michael',
    lastName: 'Miller',
    fullName: 'Michael Miller',
  },
  {
    id: 'pat-008',
    patientNumber: 'P008',
    firstName: 'Lisa',
    lastName: 'Garcia',
    fullName: 'Lisa Garcia',
  },
];

// Generate time slots from 8:00 AM to 5:00 PM
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  
  for (let hour = 8; hour < 17; hour++) {
    // Generate 30-minute intervals
    for (let minute = 0; minute < 60; minute += 30) {
      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Convert to 12-hour format for display
      const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 || hour === 12 ? 12 : hour12;
      const time12 = `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
      
      // Mock some slots as unavailable (for demo purposes)
      const isAvailable = Math.random() > 0.3; // 70% chance of being available
      
      slots.push({
        value: time24,
        label: time12,
        isAvailable,
      });
    }
  }
  
  return slots;
};

export const MOCK_TIME_SLOTS = generateTimeSlots();

// Helper functions for mock data
export const getAvailableDoctors = (): Doctor[] => {
  return MOCK_DOCTORS.filter(doctor => doctor.isAvailable);
};

export const getAvailableTimeSlots = (): TimeSlot[] => {
  return MOCK_TIME_SLOTS.filter(slot => slot.isAvailable);
};

export const searchPatients = (query: string): Patient[] => {
  if (!query || query.length < 2) return [];
  
  const lowercaseQuery = query.toLowerCase();
  return MOCK_PATIENTS.filter(patient =>
    patient.fullName.toLowerCase().includes(lowercaseQuery) ||
    patient.patientNumber.toLowerCase().includes(lowercaseQuery)
  ).slice(0, 5); // Limit to 5 results for UI
};

export const getDoctorSelectOptions = () => {
  return getAvailableDoctors().map(doctor => ({
    value: doctor.id,
    label: `Dr. ${doctor.firstName} ${doctor.lastName} - ${doctor.specialization}`,
  }));
};

export const getTimeSlotSelectOptions = () => {
  return getAvailableTimeSlots().map(slot => ({
    value: slot.value,
    label: slot.label,
  }));
};