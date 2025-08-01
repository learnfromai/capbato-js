import { injectable, inject } from 'tsyringe';
import { LabRequest } from '@nx-starter/domain';
import type { ILaboratoryRepository } from '@nx-starter/domain';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for getting all lab requests
 * Follows CQRS pattern - separate from commands
 */
@injectable()
export class GetAllLabRequestsQueryHandler {
  constructor(
    @inject(TOKENS.LaboratoryRepository) private laboratoryRepository: ILaboratoryRepository
  ) {}

  async execute(): Promise<LabRequest[]> {
    return await this.laboratoryRepository.getAllLabRequests();
  }
}