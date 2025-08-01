import { injectable, inject } from 'tsyringe';
import { LabRequest, PatientId, LabStatus } from '@nx-starter/domain';
import type { ILaboratoryRepository } from '@nx-starter/domain';
import type { CreateLabRequestCommand } from '../../dto/LaboratoryCommands';
import { TOKENS } from '../../di/tokens';
import { LaboratoryMapper } from '../../mappers/LaboratoryMapper';

/**
 * Use case for creating a new lab request
 * Handles all business logic and validation for lab request creation
 */
@injectable()
export class CreateLabRequestUseCase {
  constructor(
    @inject(TOKENS.LaboratoryRepository) private laboratoryRepository: ILaboratoryRepository
  ) {}

  async execute(command: CreateLabRequestCommand): Promise<LabRequest> {
    // Validate command using value objects (domain validation)
    const patientId = new PatientId(command.patient_id);
    
    // Convert DTO test selections to Map
    const selectedTests = LaboratoryMapper.createLabRequestDtoToTestSelections(command);
    
    // Ensure at least one test is selected
    if (selectedTests.size === 0) {
      throw new Error('At least one test must be selected');
    }

    // Create lab request entity with domain logic
    const labRequest = new LabRequest(
      patientId,
      command.patient_name,
      command.age_gender,
      command.request_date,
      selectedTests,
      LabStatus.pending(), // new requests are always pending
      command.others,
      new Map(), // no test results yet
      undefined, // no date taken yet
      undefined, // no ID yet
      new Date()
    );

    // Validate business invariants
    labRequest.validate();

    // Persist using repository
    const createdLabRequest = await this.laboratoryRepository.createLabRequest(labRequest);

    return createdLabRequest;
  }
}