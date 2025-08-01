import { injectable, inject } from 'tsyringe';
import { LabRequestId } from '@nx-starter/domain';
import type { ILaboratoryRepository } from '@nx-starter/domain';
import type { DeleteLabRequestCommand } from '../../dto/LaboratoryCommands';
import { TOKENS } from '../../di/tokens';
import { LabRequestNotFoundException } from '@nx-starter/domain';

/**
 * Use case for deleting a lab request
 * Handles all business logic and validation for lab request deletion
 */
@injectable()
export class DeleteLabRequestUseCase {
  constructor(
    @inject(TOKENS.LaboratoryRepository) private laboratoryRepository: ILaboratoryRepository
  ) {}

  async execute(command: DeleteLabRequestCommand): Promise<void> {
    // Validate that the lab request exists
    const labRequestId = new LabRequestId(command.id);
    const existsCheck = await this.laboratoryRepository.exists(labRequestId);

    if (!existsCheck) {
      throw new LabRequestNotFoundException(command.id);
    }

    // Get the lab request to check business rules
    const labRequest = await this.laboratoryRepository.getLabRequestById(labRequestId);
    
    if (!labRequest) {
      throw new LabRequestNotFoundException(command.id);
    }

    // Business rule: Cannot delete completed lab requests
    if (labRequest.status.isComplete()) {
      throw new Error('Cannot delete completed lab requests');
    }

    // Delete using repository
    await this.laboratoryRepository.deleteLabRequest(labRequestId);
  }
}