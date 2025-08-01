import { injectable, inject } from 'tsyringe';
import { LabRequest, PatientId, PatientName, AgeGender } from '@nx-starter/domain';
import type { ILabRequestRepository } from '@nx-starter/domain';
import type { CreateLabRequestCommand } from '../../dto/LaboratoryCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for creating a new lab request
 * Handles all business logic and validation for lab request creation
 */
@injectable()
export class CreateLabRequestUseCase {
  constructor(
    @inject(TOKENS.LabRequestRepository) private labRequestRepository: ILabRequestRepository
  ) {}

  async execute(command: CreateLabRequestCommand): Promise<LabRequest> {
    // Validate command using value objects (domain validation)
    const patientId = new PatientId(command.patientId);
    const patientName = new PatientName(command.patientName);
    const ageGender = new AgeGender(command.ageGender);

    // Convert command fields to tests record (filter out empty values)
    const tests: Record<string, string> = {};
    
    // Map camelCase command fields to snake_case for consistency with legacy
    const testFields = {
      cbc_with_platelet: command.cbcWithPlatelet,
      pregnancy_test: command.pregnancyTest,
      urinalysis: command.urinalysis,
      fecalysis: command.fecalysis,
      occult_blood_test: command.occultBloodTest,
      hepa_b_screening: command.hepaBScreening,
      hepa_a_screening: command.hepaAScreening,
      hepatitis_profile: command.hepatitisProfile,
      vdrl_rpr: command.vdrlRpr,
      dengue_ns1: command.dengueNs1,
      ca_125_cea_psa: command.ca125CeaPsa,
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

    // Filter out empty/undefined values and "no" values
    Object.entries(testFields).forEach(([key, value]) => {
      if (value && value.trim() && value.toLowerCase() !== 'no') {
        tests[key] = value.trim();
      }
    });

    // Create lab request entity with domain logic
    const labRequest = new LabRequest(
      patientId,
      patientName,
      ageGender,
      command.requestDate,
      tests,
      undefined, // no ID yet
      command.others,
      'Pending', // new requests are always pending
      undefined // no date taken yet
    );

    // Validate business invariants
    labRequest.validate();

    // Persist using repository
    const id = await this.labRequestRepository.create(labRequest);

    // Return the created lab request with ID
    return new LabRequest(
      patientId,
      patientName,
      ageGender,
      labRequest.requestDate,
      tests,
      id,
      labRequest.others,
      labRequest.status,
      labRequest.dateTaken
    );
  }
}