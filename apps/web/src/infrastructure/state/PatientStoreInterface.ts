import { PatientListDto, CreatePatientCommand, PatientDto } from '@nx-starter/application-shared';

export interface PatientStoreState {
  patients: PatientListDto[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface PatientStoreActions {
  loadPatients(): Promise<void>;
  createPatient(command: CreatePatientCommand): Promise<PatientDto>;
  clearError(): void;
  getIsLoading(): boolean;
  getIsIdle(): boolean;
  getHasError(): boolean;
}

export interface PatientStore extends PatientStoreState, PatientStoreActions {}