import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { container } from '../di/container';
import type { PatientStore } from './PatientStoreInterface';
import type { IPatientApiService } from '../api/IPatientApiService';
import type { CreatePatientCommand } from '@nx-starter/application-shared';

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
          createStatus: 'idle',
          createError: null,

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

          getIsCreating() {
            return get().createStatus === 'loading';
          },

          getCreateHasError() {
            return get().createStatus === 'failed';
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

          async createPatient(command: CreatePatientCommand) {
            set((state) => {
              state.createStatus = 'loading';
              state.createError = null;
            });

            try {
              await getApiService().createPatient(command);
              set((state) => {
                state.createStatus = 'succeeded';
                // Refresh the patients list to include the new patient
                // Note: We don't directly add to the list here to maintain consistency with server data
              });
              
              // Refresh the patients list
              await get().loadPatients();
              
              return true;
            } catch (error) {
              set((state) => {
                state.createError =
                  error instanceof Error
                    ? error.message
                    : 'Failed to create patient';
                state.createStatus = 'failed';
              });
              return false;
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

          clearCreateError() {
            set((state) => {
              state.createError = null;
              if (state.createStatus === 'failed') {
                state.createStatus = 'idle';
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