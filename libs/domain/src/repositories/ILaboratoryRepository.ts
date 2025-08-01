import { LabRequest } from '../entities/LabRequest';
import { BloodChemistry } from '../entities/BloodChemistry';
import { LabRequestId } from '../value-objects/LabRequestId';
import { PatientId } from '../value-objects/PatientId';
import { LabStatus } from '../value-objects/LabStatus';

/**
 * Repository interface for Laboratory operations
 * Following Clean Architecture - Repository is defined in Domain layer
 * Implementation details are in Infrastructure layer
 */
export interface ILaboratoryRepository {
  // Lab Request operations
  createLabRequest(labRequest: LabRequest): Promise<LabRequest>;
  updateLabRequest(labRequest: LabRequest): Promise<LabRequest>;
  deleteLabRequest(id: LabRequestId): Promise<void>;
  getLabRequestById(id: LabRequestId): Promise<LabRequest | null>;
  getLabRequestByPatientId(patientId: PatientId): Promise<LabRequest | null>;
  getAllLabRequests(): Promise<LabRequest[]>;
  getLabRequestsByStatus(status: LabStatus): Promise<LabRequest[]>;
  getCompletedLabRequests(): Promise<LabRequest[]>;
  getLabRequestsByPatientIdAndDate(patientId: PatientId, requestDate: Date): Promise<LabRequest | null>;

  // Blood Chemistry operations
  createBloodChemistry(bloodChemistry: BloodChemistry): Promise<BloodChemistry>;
  updateBloodChemistry(bloodChemistry: BloodChemistry): Promise<BloodChemistry>;
  deleteBloodChemistry(id: LabRequestId): Promise<void>;
  getBloodChemistryById(id: LabRequestId): Promise<BloodChemistry | null>;
  getAllBloodChemistries(): Promise<BloodChemistry[]>;
  getBloodChemistriesByPatientName(patientName: string): Promise<BloodChemistry[]>;
  getBloodChemistriesByDateRange(startDate: Date, endDate: Date): Promise<BloodChemistry[]>;

  // Utility operations
  exists(id: LabRequestId): Promise<boolean>;
  count(): Promise<number>;
  countByStatus(status: LabStatus): Promise<number>;
}