import type { LabRequest } from '@nx-starter/domain';
import type { LabRequestDto, CompletedLabTestDto } from '../dto/LaboratoryDto';

/**
 * Mapper for LabRequest entity to/from DTOs
 * Handles data transformation between domain entities and API DTOs
 */
export class LabRequestMapper {
  /**
   * Convert LabRequest entity to DTO
   */
  static toDto(labRequest: LabRequest): LabRequestDto {
    const tests = Object.fromEntries(labRequest.tests);
    
    return {
      id: labRequest.stringId,
      patientId: labRequest.patientIdValue,
      patientName: labRequest.patientNameValue,
      ageGender: labRequest.ageGenderValue,
      requestDate: labRequest.requestDate.toISOString(),
      others: labRequest.others,
      status: labRequest.status,
      dateTaken: labRequest.dateTaken?.toISOString(),
      tests,
      // Individual test fields for backward compatibility
      cbcWithPlatelet: tests.cbc_with_platelet,
      pregnancyTest: tests.pregnancy_test,
      urinalysis: tests.urinalysis,
      fecalysis: tests.fecalysis,
      occultBloodTest: tests.occult_blood_test,
      hepaBScreening: tests.hepa_b_screening,
      hepaAScreening: tests.hepa_a_screening,
      hepatitisProfile: tests.hepatitis_profile,
      vdrlRpr: tests.vdrl_rpr,
      dengueNs1: tests.dengue_ns1,
      ca125CeaPsa: tests.ca_125_cea_psa,
      fbs: tests.fbs,
      bun: tests.bun,
      creatinine: tests.creatinine,
      bloodUricAcid: tests.blood_uric_acid,
      lipidProfile: tests.lipid_profile,
      sgot: tests.sgot,
      sgpt: tests.sgpt,
      alp: tests.alp,
      sodiumNa: tests.sodium_na,
      potassiumK: tests.potassium_k,
      hbalc: tests.hbalc,
      ecg: tests.ecg,
      t3: tests.t3,
      t4: tests.t4,
      ft3: tests.ft3,
      ft4: tests.ft4,
      tsh: tests.tsh,
    };
  }

  /**
   * Convert array of LabRequest entities to DTOs
   */
  static toDtoArray(labRequests: LabRequest[]): LabRequestDto[] {
    return labRequests.map(this.toDto);
  }

  /**
   * Convert LabRequest entity to CompletedLabTestDto for legacy API compatibility
   */
  static toCompletedLabTestDto(labRequest: LabRequest): CompletedLabTestDto {
    const tests: string[] = [];
    
    // Map field names to display names
    const testMap = {
      cbc_with_platelet: "CBC with Platelet",
      pregnancy_test: "Pregnancy Test", 
      urinalysis: "Urinalysis",
      fecalysis: "Fecalysis",
      occult_blood_test: "Occult Blood Test",
      hepa_b_screening: "Hepa B Screening",
      hepa_a_screening: "Hepa A Screening", 
      hepatitis_profile: "Hepatitis Profile",
      vdrl_rpr: "VDRL/RPR",
      dengue_ns1: "Dengue NS1",
      ca_125_cea_psa: "CA 125 / CEA / PSA",
      fbs: "FBS",
      bun: "BUN",
      creatinine: "Creatinine",
      blood_uric_acid: "Blood Uric Acid",
      lipid_profile: "Lipid Profile",
      sgot: "SGOT",
      sgpt: "SGPT", 
      alp: "ALP",
      sodium_na: "Sodium Na",
      potassium_k: "Potassium K+",
      hbalc: "HBA1C",
      ecg: "ECG",
      t3: "T3",
      t4: "T4", 
      ft3: "FT3",
      ft4: "FT4",
      tsh: "TSH"
    };

    // Find selected tests
    labRequest.tests.forEach((labTest, testName) => {
      const displayName = testMap[testName as keyof typeof testMap];
      if (displayName && labTest.isSelected()) {
        tests.push(displayName);
      }
    });

    return {
      patientId: labRequest.patientIdValue,
      patientName: labRequest.patientNameValue,
      labTest: tests.join(", "),
      date: (labRequest.dateTaken || labRequest.requestDate).toISOString(),
      status: labRequest.status
    };
  }

  /**
   * Convert array of LabRequest entities to CompletedLabTestDto array
   */
  static toCompletedLabTestDtoArray(labRequests: LabRequest[]): CompletedLabTestDto[] {
    return labRequests.map(this.toCompletedLabTestDto);
  }

  /**
   * Convert plain object from repository to LabRequest entity
   */
  static fromPlainObject(data: any): LabRequest {
    const tests: Record<string, string> = {};
    
    // Extract test fields from the plain object
    const testFields = [
      'cbc_with_platelet', 'pregnancy_test', 'urinalysis', 'fecalysis', 'occult_blood_test',
      'hepa_b_screening', 'hepa_a_screening', 'hepatitis_profile', 'vdrl_rpr', 'dengue_ns1', 'ca_125_cea_psa',
      'fbs', 'bun', 'creatinine', 'blood_uric_acid', 'lipid_profile',
      'sgot', 'sgpt', 'alp', 'sodium_na', 'potassium_k',
      'hbalc', 'ecg', 't3', 't4', 'ft3', 'ft4', 'tsh'
    ];

    testFields.forEach(field => {
      if (data[field] && data[field].toString().toLowerCase() !== 'no') {
        tests[field] = data[field].toString();
      }
    });

    return new LabRequest(
      data.patient_id || data.patientId,
      data.patient_name || data.patientName,
      data.age_gender || data.ageGender,
      new Date(data.request_date || data.requestDate),
      tests,
      data.id,
      data.others,
      data.status || 'Pending',
      data.date_taken || data.dateTaken ? new Date(data.date_taken || data.dateTaken) : undefined
    );
  }

  /**
   * Convert LabRequest entity to plain object for repository storage
   */
  static toPlainObject(labRequest: LabRequest): any {
    const tests = Object.fromEntries(labRequest.tests);
    
    return {
      id: labRequest.stringId,
      patient_id: labRequest.patientIdValue,
      patient_name: labRequest.patientNameValue,
      age_gender: labRequest.ageGenderValue,
      request_date: labRequest.requestDate,
      others: labRequest.others,
      status: labRequest.status,
      date_taken: labRequest.dateTaken,
      // Individual test fields
      ...tests
    };
  }
}