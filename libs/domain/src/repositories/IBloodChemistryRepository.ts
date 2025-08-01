import { BloodChemistry } from '../entities/BloodChemistry';

export interface IBloodChemistryRepository {
  getAll(): Promise<BloodChemistry[]>;
  create(bloodChemistry: BloodChemistry): Promise<string>;
  update(id: string, changes: Partial<BloodChemistry>): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<BloodChemistry | undefined>;
  getByPatientName(patientName: string): Promise<BloodChemistry[]>;
  getByDateRange(startDate: Date, endDate: Date): Promise<BloodChemistry[]>;
}