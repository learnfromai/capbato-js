import { PatientListDto, CreatePatientCommand, PatientDto } from '@nx-starter/application-shared';

export interface PatientStoreState {
  patients: PatientListDto[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  creatingPatient: boolean;
}

export interface PatientStoreActions {
  loadPatients(): Promise<void>;
  createPatient(command: CreatePatientCommand): Promise<PatientDto>;
  clearError(): void;
  getIsLoading(): boolean;
  getIsIdle(): boolean;
  getHasError(): boolean;
  getIsCreatingPatient(): boolean;
}

export interface PatientStore extends PatientStoreState, PatientStoreActions {}