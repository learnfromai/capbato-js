import { injectable, inject } from 'tsyringe';
import type { BloodChemistry } from '@nx-starter/domain';
import type { IBloodChemistryRepository } from '@nx-starter/domain';
import type { 
  GetAllBloodChemistryQuery,
  GetBloodChemistryByIdQuery,
  GetBloodChemistryByPatientNameQuery,
  GetBloodChemistryByDateRangeQuery
} from '../../dto/LaboratoryQueries';
import { TOKENS } from '../../di/tokens';
import { BloodChemistryNotFoundException } from '@nx-starter/domain';

/**
 * Query handler for getting all blood chemistry results
 */
@injectable()
export class GetAllBloodChemistryQueryHandler {
  constructor(
    @inject(TOKENS.BloodChemistryRepository) private bloodChemistryRepository: IBloodChemistryRepository
  ) {}

  async execute(query: GetAllBloodChemistryQuery): Promise<BloodChemistry[]> {
    return await this.bloodChemistryRepository.getAll();
  }
}

/**
 * Query handler for getting a blood chemistry result by ID
 */
@injectable()
export class GetBloodChemistryByIdQueryHandler {
  constructor(
    @inject(TOKENS.BloodChemistryRepository) private bloodChemistryRepository: IBloodChemistryRepository
  ) {}

  async execute(query: GetBloodChemistryByIdQuery): Promise<BloodChemistry> {
    const bloodChemistry = await this.bloodChemistryRepository.getById(query.id);
    
    if (!bloodChemistry) {
      throw new BloodChemistryNotFoundException(query.id);
    }

    return bloodChemistry;
  }
}

/**
 * Query handler for getting blood chemistry results by patient name
 */
@injectable()
export class GetBloodChemistryByPatientNameQueryHandler {
  constructor(
    @inject(TOKENS.BloodChemistryRepository) private bloodChemistryRepository: IBloodChemistryRepository
  ) {}

  async execute(query: GetBloodChemistryByPatientNameQuery): Promise<BloodChemistry[]> {
    return await this.bloodChemistryRepository.getByPatientName(query.patientName);
  }
}

/**
 * Query handler for getting blood chemistry results by date range
 */
@injectable()
export class GetBloodChemistryByDateRangeQueryHandler {
  constructor(
    @inject(TOKENS.BloodChemistryRepository) private bloodChemistryRepository: IBloodChemistryRepository
  ) {}

  async execute(query: GetBloodChemistryByDateRangeQuery): Promise<BloodChemistry[]> {
    return await this.bloodChemistryRepository.getByDateRange(query.startDate, query.endDate);
  }
}