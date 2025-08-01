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
          creatingPatient: false,

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

          getIsCreatingPatient() {
            return get().creatingPatient;
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
              state.creatingPatient = true;
              state.error = null;
            });

            try {
              const response = await getApiService().createPatient(command);
              
              // Add the new patient to the patients list (using the list format)
              const newPatientListItem = {
                id: response.data.id,
                patientNumber: response.data.patientNumber,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                middleName: response.data.middleName,
                age: response.data.age,
                gender: response.data.gender,
                dateOfBirth: response.data.dateOfBirth,
              };

              set((state) => {
                state.patients.push(newPatientListItem);
                state.creatingPatient = false;
              });

              return response.data;
            } catch (error) {
              set((state) => {
                state.error =
                  error instanceof Error
                    ? error.message
                    : 'Failed to create patient';
                state.creatingPatient = false;
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