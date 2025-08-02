export interface AppointmentDto {
  id: string;
  date: string;
  time: string;
  reasonForVisit: string;
  labTestsDone?: string;
  prescriptions?: string;
  status: string;
}

export interface LaboratoryRequestDto {
  id: string;
  testType: string;
  requestDate: string;
  status: string;
}

export interface MedicalRecordDto {
  id: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
}

export interface PrescriptionDto {
  id: string;
  date: string;
  medication: string;
  dosage: string;
  instructions: string;
  prescribedBy: string;
}

export interface PatientDetailsData {
  patient: {
    id: string;
    patientNumber: string;
    fullName: string;
    gender: string;
    age: number;
    dateOfBirth: string;
    contactNumber: string;
    address: string;
  };
  guardian?: {
    fullName: string;
    gender: string;
    relationship: string;
    contactNumber: string;
    address: string;
  };
  appointments: AppointmentDto[];
  medicalRecords: MedicalRecordDto[];
  prescriptions: PrescriptionDto[];
  laboratoryRequests: LaboratoryRequestDto[];
}