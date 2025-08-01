import { injectable, inject } from 'tsyringe';
import type { ILabRequestRepository } from '@nx-starter/domain';
import type { UpdateLabRequestResultsCommand } from '../../dto/LaboratoryCommands';
import { TOKENS } from '../../di/tokens';
import { LabRequestNotFoundException } from '@nx-starter/domain';

/**
 * Use case for updating lab request results
 * Handles business logic and validation for updating lab request test results
 */
@injectable()
export class UpdateLabRequestResultsUseCase {
  constructor(
    @inject(TOKENS.LabRequestRepository) private labRequestRepository: ILabRequestRepository
  ) {}

  async execute(command: UpdateLabRequestResultsCommand): Promise<void> {
    // Find the lab request by patient ID and request date
    const labRequest = await this.labRequestRepository.getByPatientIdAndDate(
      command.patientId,
      command.requestDate
    );

    if (!labRequest) {
      throw new LabRequestNotFoundException(`${command.patientId} on ${command.requestDate.toISOString()}`);
    }

    // Prepare update data - filter out empty values
    const updateData: Record<string, string> = {};
    
    // Map camelCase command fields to snake_case for consistency
    const resultFields = {
      fbs: command.fbs,
      bun: command.bun,
      creatinine: command.creatinine,
      blood_uric_acid: command.bloodUricAcid,
      lipid_profile: command.lipidProfile,
      sgot: command.sgot,
      sgpt: command.sgpt,
      alp: command.alp,
      sodium_na: command.sodiumNa,
      potassium_k: command.potassiumK,
      hbalc: command.hbalc,
      ecg: command.ecg,
      t3: command.t3,
      t4: command.t4,
      ft3: command.ft3,
      ft4: command.ft4,
      tsh: command.tsh,
    };

    // Filter out empty/undefined values
    Object.entries(resultFields).forEach(([key, value]) => {
      if (value && value.trim()) {
        updateData[key] = value.trim();
      }
    });

    // Add status and date taken if provided
    if (command.status) {
      updateData.status = command.status;
    }
    if (command.dateTaken) {
      updateData.date_taken = command.dateTaken.toISOString();
    }

    // If no valid fields to update, throw an error
    if (Object.keys(updateData).length === 0) {
      throw new Error('No valid lab fields to update');
    }

    // Use repository's specific update method for lab request results
    await this.labRequestRepository.updateResults(
      command.patientId,
      command.requestDate,
      updateData
    );
  }
}