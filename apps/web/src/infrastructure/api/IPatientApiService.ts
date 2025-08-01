import { PatientListDto, CreatePatientCommand, PatientDto } from '@nx-starter/application-shared';

export interface PatientListResponse {
  success: boolean;
  data: PatientListDto[];
  message?: string;
}

export interface CreatePatientResponse {
  success: boolean;
  data: PatientDto;
  message?: string;
}

export interface IPatientApiService {
  getAllPatients(): Promise<PatientListResponse>;
  createPatient(command: CreatePatientCommand): Promise<CreatePatientResponse>;
}