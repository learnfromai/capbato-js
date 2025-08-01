import { PatientListDto, CreatePatientCommand } from '@nx-starter/application-shared';

export interface PatientStoreState {
  patients: PatientListDto[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  createError: string | null;
}

export interface PatientStoreActions {
  loadPatients(): Promise<void>;
  createPatient(command: CreatePatientCommand): Promise<boolean>;
  clearError(): void;
  clearCreateError(): void;
  getIsLoading(): boolean;
  getIsIdle(): boolean;
  getHasError(): boolean;
  getIsCreating(): boolean;
  getCreateHasError(): boolean;
}

export interface PatientStore extends PatientStoreState, PatientStoreActions {}