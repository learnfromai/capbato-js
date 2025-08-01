import { injectable, inject } from 'tsyringe';
import { LabRequest, PatientId } from '@nx-starter/domain';
import type { ILaboratoryRepository } from '@nx-starter/domain';
import type { GetLabRequestByPatientIdQuery } from '../../dto/LaboratoryQueries';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for getting lab request by patient ID
 * Returns the most recent lab request for a patient
 */
@injectable()
export class GetLabRequestByPatientIdQueryHandler {
  constructor(
    @inject(TOKENS.LaboratoryRepository) private laboratoryRepository: ILaboratoryRepository
  ) {}

  async execute(query: GetLabRequestByPatientIdQuery): Promise<LabRequest | null> {
    const patientId = new PatientId(query.patientId);
    return await this.laboratoryRepository.getLabRequestByPatientId(patientId);
  }
}