import { injectable, inject } from 'tsyringe';
import { BloodChemistry } from '@nx-starter/domain';
import type { ILaboratoryRepository } from '@nx-starter/domain';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for getting all blood chemistry records
 */
@injectable()
export class GetAllBloodChemistriesQueryHandler {
  constructor(
    @inject(TOKENS.LaboratoryRepository) private laboratoryRepository: ILaboratoryRepository
  ) {}

  async execute(): Promise<BloodChemistry[]> {
    return await this.laboratoryRepository.getAllBloodChemistries();
  }
}