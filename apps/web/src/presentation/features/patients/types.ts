export interface Patient {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD format
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phoneNumber: string;
  email?: string;
  address: {
    street: string;
    city: string;
    province: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  medicalHistory?: string[];
  allergies?: string[];
  bloodType?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface GuardianDetails {
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  relationship: string;
  contactNumber: string;
  address: string;
}

export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  reasonForVisit: string;
  labTestsDone: string;
  prescriptions: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
}

export interface PatientDetails extends Patient {
  guardian?: GuardianDetails;
  appointments?: Appointment[];
}

export interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phoneNumber: string;
  email?: string;
  street: string;
  city: string;
  province: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  medicalHistory?: string;
  allergies?: string;
  bloodType?: string;
}
