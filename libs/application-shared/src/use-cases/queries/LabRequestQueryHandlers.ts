import { injectable, inject } from 'tsyringe';
import type { LabRequest } from '@nx-starter/domain';
import type { ILabRequestRepository } from '@nx-starter/domain';
import type { 
  GetAllLabRequestsQuery,
  GetLabRequestByIdQuery,
  GetLabRequestByPatientIdQuery,
  GetCompletedLabRequestsQuery
} from '../../dto/LaboratoryQueries';
import { TOKENS } from '../../di/tokens';
import { LabRequestNotFoundException } from '@nx-starter/domain';

/**
 * Query handler for getting all lab requests
 */
@injectable()
export class GetAllLabRequestsQueryHandler {
  constructor(
    @inject(TOKENS.LabRequestRepository) private labRequestRepository: ILabRequestRepository
  ) {}

  async execute(query: GetAllLabRequestsQuery): Promise<LabRequest[]> {
    return await this.labRequestRepository.getAll();
  }
}

/**
 * Query handler for getting a lab request by ID
 */
@injectable()
export class GetLabRequestByIdQueryHandler {
  constructor(
    @inject(TOKENS.LabRequestRepository) private labRequestRepository: ILabRequestRepository
  ) {}

  async execute(query: GetLabRequestByIdQuery): Promise<LabRequest> {
    const labRequest = await this.labRequestRepository.getById(query.id);
    
    if (!labRequest) {
      throw new LabRequestNotFoundException(query.id);
    }

    return labRequest;
  }
}

/**
 * Query handler for getting lab requests by patient ID
 */
@injectable()
export class GetLabRequestByPatientIdQueryHandler {
  constructor(
    @inject(TOKENS.LabRequestRepository) private labRequestRepository: ILabRequestRepository
  ) {}

  async execute(query: GetLabRequestByPatientIdQuery): Promise<LabRequest[]> {
    return await this.labRequestRepository.getByPatientId(query.patientId);
  }
}

/**
 * Query handler for getting completed lab requests
 */
@injectable()
export class GetCompletedLabRequestsQueryHandler {
  constructor(
    @inject(TOKENS.LabRequestRepository) private labRequestRepository: ILabRequestRepository
  ) {}

  async execute(query: GetCompletedLabRequestsQuery): Promise<LabRequest[]> {
    return await this.labRequestRepository.getCompletedRequests();
  }
}

/**
 * Query handler for getting the most recent lab request by patient ID
 * This matches the legacy endpoint behavior
 */
@injectable()
export class GetMostRecentLabRequestByPatientIdQueryHandler {
  constructor(
    @inject(TOKENS.LabRequestRepository) private labRequestRepository: ILabRequestRepository
  ) {}

  async execute(query: GetLabRequestByPatientIdQuery): Promise<LabRequest> {
    const labRequests = await this.labRequestRepository.getByPatientId(query.patientId);
    
    if (!labRequests || labRequests.length === 0) {
      throw new LabRequestNotFoundException(`for patient ${query.patientId}`);
    }

    // Return the most recent one (assuming they're ordered by creation date)
    // The repository should handle ordering, but we'll sort by request date as fallback
    const mostRecent = labRequests.sort((a, b) => 
      new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    )[0];

    return mostRecent;
  }
}