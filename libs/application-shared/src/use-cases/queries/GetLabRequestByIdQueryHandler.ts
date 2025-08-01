import { injectable, inject } from 'tsyringe';
import { LabRequest, LabRequestId } from '@nx-starter/domain';
import type { ILaboratoryRepository } from '@nx-starter/domain';
import type { GetLabRequestByIdQuery } from '../../dto/LaboratoryQueries';
import { TOKENS } from '../../di/tokens';
import { LabRequestNotFoundException } from '@nx-starter/domain';

/**
 * Query handler for getting lab request by ID
 */
@injectable()
export class GetLabRequestByIdQueryHandler {
  constructor(
    @inject(TOKENS.LaboratoryRepository) private laboratoryRepository: ILaboratoryRepository
  ) {}

  async execute(query: GetLabRequestByIdQuery): Promise<LabRequest> {
    const labRequestId = new LabRequestId(query.id);
    const labRequest = await this.laboratoryRepository.getLabRequestById(labRequestId);
    
    if (!labRequest) {
      throw new LabRequestNotFoundException(query.id);
    }
    
    return labRequest;
  }
}