import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { container } from '../di/container';
import type { PatientStore } from './PatientStoreInterface';
import type { IPatientApiService } from '../api/IPatientApiService';
import { CreatePatientCommand, PatientDto, PatientMapper } from '@nx-starter/application-shared';

export const usePatientStore = create<PatientStore>()(
  subscribeWithSelector(
    devtools(
      immer((set, get) => {
        // Lazy resolve API service directly - no need for complex repository pattern for simple display
        const getApiService = () =>
          container.resolve<IPatientApiService>('IPatientApiService');

        return {
          // Initial state
          patients: [],
          status: 'idle',
          error: null,

          // Computed values as functions
          getIsLoading() {
            return get().status === 'loading';
          },

          getIsIdle() {
            return get().status === 'idle';
          },

          getHasError() {
            return get().status === 'failed';
          },

          // Actions
          async loadPatients() {
            set((state) => {
              state.status = 'loading';
              state.error = null;
            });

            try {
              const response = await getApiService().getAllPatients();
              set((state) => {
                state.patients = response.data;
                state.status = 'succeeded';
              });
            } catch (error) {
              set((state) => {
                state.error =
                  error instanceof Error
                    ? error.message
                    : 'Failed to load patients';
                state.status = 'failed';
              });
            }
          },

          async createPatient(command: CreatePatientCommand): Promise<PatientDto> {
            set((state) => {
              state.status = 'loading';
              state.error = null;
            });

            try {
              const response = await getApiService().createPatient(command);
              const patientDto = response.data;

              // Add the new patient to the list if it's not already there
              set((state) => {
                const existingIndex = state.patients.findIndex(p => p.id === patientDto.id);
                if (existingIndex === -1) {
                  // Convert PatientDto to PatientListDto for the list
                  const listDto = PatientMapper.toListDto(patientDto);
                  state.patients.unshift(listDto);
                }
                state.status = 'succeeded';
              });

              return patientDto;
            } catch (error) {
              set((state) => {
                state.error =
                  error instanceof Error
                    ? error.message
                    : 'Failed to create patient';
                state.status = 'failed';
              });
              throw error;
            }
          },

          clearError() {
            set((state) => {
              state.error = null;
              if (state.status === 'failed') {
                state.status = 'idle';
              }
            });
          },
        };
      }),
      {
        name: 'patient-store',
      }
    )
  )
);