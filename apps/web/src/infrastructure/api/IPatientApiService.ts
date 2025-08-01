import { PatientListDto, PatientDto, CreatePatientCommand } from '@nx-starter/application-shared';

export interface PatientListResponse {
  success: boolean;
  data: PatientListDto[];
  message?: string;
}

export interface PatientResponse {
  success: boolean;
  data: PatientDto;
  message?: string;
}

export interface IPatientApiService {
  getAllPatients(): Promise<PatientListResponse>;
  createPatient(command: CreatePatientCommand): Promise<PatientResponse>;
}