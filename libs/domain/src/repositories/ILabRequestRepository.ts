import { LabRequest } from '../entities/LabRequest';

export interface ILabRequestRepository {
  getAll(): Promise<LabRequest[]>;
  create(labRequest: LabRequest): Promise<string>;
  update(id: string, changes: Partial<LabRequest>): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<LabRequest | undefined>;
  getByPatientId(patientId: string): Promise<LabRequest[]>;
  getCompletedRequests(): Promise<LabRequest[]>;
  getByPatientIdAndDate(patientId: string, requestDate: Date): Promise<LabRequest | undefined>;
  updateResults(patientId: string, requestDate: Date, results: Record<string, string>): Promise<void>;
}