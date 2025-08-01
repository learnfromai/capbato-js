import { injectable, inject } from 'tsyringe';
import { LabRequest, LabStatus } from '@nx-starter/domain';
import type { ILaboratoryRepository } from '@nx-starter/domain';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for getting completed lab requests
 * Returns lab requests with status 'Complete'
 */
@injectable()
export class GetCompletedLabRequestsQueryHandler {
  constructor(
    @inject(TOKENS.LaboratoryRepository) private laboratoryRepository: ILaboratoryRepository
  ) {}

  async execute(): Promise<LabRequest[]> {
    const completedStatus = LabStatus.complete();
    return await this.laboratoryRepository.getLabRequestsByStatus(completedStatus);
  }
}