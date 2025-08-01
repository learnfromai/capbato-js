import { injectable } from 'tsyringe';
import { LabRequest } from '@nx-starter/domain';
import type { ILabRequestRepository } from '@nx-starter/domain';
import { generateId } from '@nx-starter/utils-core';

/**
 * In-memory implementation of ILabRequestRepository
 * Useful for development and testing
 */
@injectable()
export class InMemoryLabRequestRepository implements ILabRequestRepository {
  private labRequests: Map<string, LabRequest> = new Map();

  async getAll(): Promise<LabRequest[]> {
    return Array.from(this.labRequests.values()).sort(
      (a, b) => b.requestDate.getTime() - a.requestDate.getTime()
    );
  }

  async create(labRequest: LabRequest): Promise<string> {
    const id = generateId();
    const labRequestWithId = new LabRequest(
      labRequest.patientId,
      labRequest.patientName,
      labRequest.ageGender,
      labRequest.requestDate,
      Object.fromEntries(labRequest.tests),
      id,
      labRequest.others,
      labRequest.status,
      labRequest.dateTaken
    );

    this.labRequests.set(id, labRequestWithId);
    return id;
  }

  async update(id: string, changes: Partial<LabRequest>): Promise<void> {
    const existingLabRequest = this.labRequests.get(id);
    if (!existingLabRequest) {
      throw new Error(`Lab request with ID ${id} not found`);
    }

    // Create updated lab request with changes
    const updatedLabRequest = new LabRequest(
      existingLabRequest.patientId,
      existingLabRequest.patientName,
      existingLabRequest.ageGender,
      existingLabRequest.requestDate,
      Object.fromEntries(existingLabRequest.tests),
      id,
      existingLabRequest.others,
      changes.status !== undefined ? changes.status : existingLabRequest.status,
      changes.dateTaken !== undefined ? changes.dateTaken : existingLabRequest.dateTaken
    );

    this.labRequests.set(id, updatedLabRequest);
  }

  async delete(id: string): Promise<void> {
    if (!this.labRequests.has(id)) {
      throw new Error(`Lab request with ID ${id} not found`);
    }
    this.labRequests.delete(id);
  }

  async getById(id: string): Promise<LabRequest | undefined> {
    return this.labRequests.get(id);
  }

  async getByPatientId(patientId: string): Promise<LabRequest[]> {
    return Array.from(this.labRequests.values())
      .filter(labRequest => labRequest.patientIdValue === patientId)
      .sort((a, b) => b.requestDate.getTime() - a.requestDate.getTime());
  }

  async getCompletedRequests(): Promise<LabRequest[]> {
    return Array.from(this.labRequests.values())
      .filter(labRequest => labRequest.status === 'Complete')
      .sort((a, b) => {
        const aDate = labRequest.dateTaken || labRequest.requestDate;
        const bDate = labRequest.dateTaken || labRequest.requestDate;
        return bDate.getTime() - aDate.getTime();
      })
      .slice(0, 10); // Limit to 10 most recent
  }

  async getByPatientIdAndDate(patientId: string, requestDate: Date): Promise<LabRequest | undefined> {
    return Array.from(this.labRequests.values())
      .find(labRequest => 
        labRequest.patientIdValue === patientId && 
        labRequest.requestDate.toDateString() === requestDate.toDateString()
      );
  }

  async updateResults(patientId: string, requestDate: Date, results: Record<string, string>): Promise<void> {
    const labRequest = await this.getByPatientIdAndDate(patientId, requestDate);
    if (!labRequest) {
      throw new Error(`Lab request for patient ${patientId} on ${requestDate.toISOString()} not found`);
    }

    const id = labRequest.stringId;
    if (!id) {
      throw new Error(`Lab request ID not found`);
    }

    // Update the lab request with new results
    const updatedLabRequest = labRequest.updateTestResults(results);
    
    // Update status and date taken if provided
    let finalLabRequest = updatedLabRequest;
    if (results.status) {
      finalLabRequest = finalLabRequest.updateStatus(results.status as any);
    }
    if (results.date_taken) {
      finalLabRequest = finalLabRequest.markAsComplete(new Date(results.date_taken));
    }

    this.labRequests.set(id, finalLabRequest);
  }
}