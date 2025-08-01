import { injectable, inject } from 'tsyringe';
import { BloodChemistry } from '@nx-starter/domain';
import type { ILaboratoryRepository } from '@nx-starter/domain';
import type { CreateBloodChemistryCommand } from '../../dto/LaboratoryCommands';
import { TOKENS } from '../../di/tokens';
import { LaboratoryMapper } from '../../mappers/LaboratoryMapper';

/**
 * Use case for creating blood chemistry results
 * Handles all business logic and validation for blood chemistry creation
 */
@injectable()
export class CreateBloodChemistryUseCase {
  constructor(
    @inject(TOKENS.LaboratoryRepository) private laboratoryRepository: ILaboratoryRepository
  ) {}

  async execute(command: CreateBloodChemistryCommand): Promise<BloodChemistry> {
    // Convert DTO to blood chemistry results object
    const results = LaboratoryMapper.createBloodChemistryDtoToResults(command);

    // Create blood chemistry entity with domain logic
    const bloodChemistry = new BloodChemistry(
      command.patient_name,
      command.age,
      command.sex,
      command.date_taken,
      results,
      undefined, // no ID yet
      new Date()
    );

    // Validate business invariants
    bloodChemistry.validate();

    // Persist using repository
    const createdBloodChemistry = await this.laboratoryRepository.createBloodChemistry(bloodChemistry);

    return createdBloodChemistry;
  }
}