import { injectable, inject } from 'tsyringe';
import { BloodChemistry, PatientName } from '@nx-starter/domain';
import type { IBloodChemistryRepository } from '@nx-starter/domain';
import type { CreateBloodChemistryCommand } from '../../dto/LaboratoryCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for creating a new blood chemistry result
 * Handles all business logic and validation for blood chemistry creation
 */
@injectable()
export class CreateBloodChemistryUseCase {
  constructor(
    @inject(TOKENS.BloodChemistryRepository) private bloodChemistryRepository: IBloodChemistryRepository
  ) {}

  async execute(command: CreateBloodChemistryCommand): Promise<BloodChemistry> {
    // Validate command using value objects (domain validation)
    const patientName = new PatientName(command.patientName);

    // Convert command fields to results record (filter out empty values)
    const results: Record<string, number | string> = {};
    
    // Map camelCase command fields to snake_case for consistency with legacy
    const resultFields = {
      fbs: command.fbs,
      bun: command.bun,
      creatinine: command.creatinine,
      uric_acid: command.uricAcid,
      cholesterol: command.cholesterol,
      triglycerides: command.triglycerides,
      hdl: command.hdl,
      ldl: command.ldl,
      vldl: command.vldl,
      sodium: command.sodium,
      potassium: command.potassium,
      chloride: command.chloride,
      calcium: command.calcium,
      sgot: command.sgot,
      sgpt: command.sgpt,
      rbs: command.rbs,
      alk_phosphatase: command.alkPhosphatase,
      total_protein: command.totalProtein,
      albumin: command.albumin,
      globulin: command.globulin,
      ag_ratio: command.agRatio,
      total_bilirubin: command.totalBilirubin,
      direct_bilirubin: command.directBilirubin,
      indirect_bilirubin: command.indirectBilirubin,
      ionised_calcium: command.ionisedCalcium,
      magnesium: command.magnesium,
      hbalc: command.hbalc,
      ogtt_30min: command.ogtt30min,
      ogtt_1hr: command.ogtt1hr,
      ogtt_2hr: command.ogtt2hr,
      ppbs_2hr: command.ppbs2hr,
      inor_phosphorus: command.inorPhosphorus,
    };

    // Filter out empty/undefined/null values
    Object.entries(resultFields).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        results[key] = value;
      }
    });

    // Create blood chemistry entity with domain logic
    const bloodChemistry = new BloodChemistry(
      patientName,
      command.age,
      command.sex,
      command.dateTaken,
      results,
      undefined // no ID yet
    );

    // Validate business invariants
    bloodChemistry.validate();

    // Persist using repository
    const id = await this.bloodChemistryRepository.create(bloodChemistry);

    // Return the created blood chemistry with ID
    return new BloodChemistry(
      patientName,
      bloodChemistry.age,
      bloodChemistry.sex,
      bloodChemistry.dateTaken,
      results,
      id
    );
  }
}