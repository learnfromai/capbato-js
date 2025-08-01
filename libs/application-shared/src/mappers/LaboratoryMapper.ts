import { LabRequest, BloodChemistry, TestTypeName } from '@nx-starter/domain';
import type { LabRequestDto, BloodChemistryDto } from '../dto/LaboratoryDto';
import type { CreateLabRequestRequestDto, CreateBloodChemistryRequestDto } from '../dto/LaboratoryDto';

/**
 * Mapper for converting between Laboratory entities and DTOs
 */
export class LaboratoryMapper {
  /**
   * Maps a LabRequest entity to a LabRequestDto
   */
  static labRequestToDto(labRequest: LabRequest): LabRequestDto {
    const selectedTests = labRequest.selectedTests;
    const testResults = labRequest.testResults;

    return {
      id: labRequest.id?.value,
      patient_id: labRequest.patientIdValue,
      patient_name: labRequest.patientName,
      age_gender: labRequest.ageGender,
      request_date: labRequest.requestDate.toISOString(),
      status: labRequest.status.status,
      others: labRequest.others,
      date_taken: labRequest.dateTaken?.toISOString(),
      created_at: labRequest.createdAt.toISOString(),
      
      // Test selections
      cbc_with_platelet: selectedTests.get('cbc_with_platelet'),
      pregnancy_test: selectedTests.get('pregnancy_test'),
      urinalysis: selectedTests.get('urinalysis'),
      fecalysis: selectedTests.get('fecalysis'),
      occult_blood_test: selectedTests.get('occult_blood_test'),
      hepa_b_screening: selectedTests.get('hepa_b_screening'),
      hepa_a_screening: selectedTests.get('hepa_a_screening'),
      hepatitis_profile: selectedTests.get('hepatitis_profile'),
      vdrl_rpr: selectedTests.get('vdrl_rpr'),
      dengue_ns1: selectedTests.get('dengue_ns1'),
      ca_125_cea_psa: selectedTests.get('ca_125_cea_psa'),
      fbs: testResults.get('fbs') || selectedTests.get('fbs'),
      bun: testResults.get('bun') || selectedTests.get('bun'),
      creatinine: testResults.get('creatinine') || selectedTests.get('creatinine'),
      blood_uric_acid: testResults.get('blood_uric_acid') || selectedTests.get('blood_uric_acid'),
      lipid_profile: testResults.get('lipid_profile') || selectedTests.get('lipid_profile'),
      sgot: testResults.get('sgot') || selectedTests.get('sgot'),
      sgpt: testResults.get('sgpt') || selectedTests.get('sgpt'),
      alp: testResults.get('alp') || selectedTests.get('alp'),
      sodium_na: testResults.get('sodium_na') || selectedTests.get('sodium_na'),
      potassium_k: testResults.get('potassium_k') || selectedTests.get('potassium_k'),
      hbalc: testResults.get('hbalc') || selectedTests.get('hbalc'),
      ecg: testResults.get('ecg') || selectedTests.get('ecg'),
      t3: testResults.get('t3') || selectedTests.get('t3'),
      t4: testResults.get('t4') || selectedTests.get('t4'),
      ft3: testResults.get('ft3') || selectedTests.get('ft3'),
      ft4: testResults.get('ft4') || selectedTests.get('ft4'),
      tsh: testResults.get('tsh') || selectedTests.get('tsh'),
    };
  }

  /**
   * Maps an array of LabRequest entities to LabRequestDtos
   */
  static labRequestToDtoArray(labRequests: LabRequest[]): LabRequestDto[] {
    return labRequests.map((labRequest) => this.labRequestToDto(labRequest));
  }

  /**
   * Maps a BloodChemistry entity to a BloodChemistryDto
   */
  static bloodChemistryToDto(bloodChemistry: BloodChemistry): BloodChemistryDto {
    return {
      id: bloodChemistry.id?.value,
      patient_name: bloodChemistry.patientName,
      age: bloodChemistry.age,
      sex: bloodChemistry.sex,
      date_taken: bloodChemistry.dateTaken.toISOString(),
      created_at: bloodChemistry.createdAt.toISOString(),
      
      // Blood chemistry values
      fbs: bloodChemistry.fbs,
      bun: bloodChemistry.bun,
      creatinine: bloodChemistry.creatinine,
      uric_acid: bloodChemistry.uricAcid,
      cholesterol: bloodChemistry.cholesterol,
      triglycerides: bloodChemistry.triglycerides,
      hdl: bloodChemistry.hdl,
      ldl: bloodChemistry.ldl,
      vldl: bloodChemistry.vldl,
      sodium: bloodChemistry.sodium,
      potassium: bloodChemistry.potassium,
      chloride: bloodChemistry.chloride,
      calcium: bloodChemistry.calcium,
      sgot: bloodChemistry.sgot,
      sgpt: bloodChemistry.sgpt,
      rbs: bloodChemistry.rbs,
      alk_phosphatase: bloodChemistry.alkPhosphatase,
      total_protein: bloodChemistry.totalProtein,
      albumin: bloodChemistry.albumin,
      globulin: bloodChemistry.globulin,
      ag_ratio: bloodChemistry.agRatio,
      total_bilirubin: bloodChemistry.totalBilirubin,
      direct_bilirubin: bloodChemistry.directBilirubin,
      indirect_bilirubin: bloodChemistry.indirectBilirubin,
      ionised_calcium: bloodChemistry.ionisedCalcium,
      magnesium: bloodChemistry.magnesium,
      hbalc: bloodChemistry.hba1c,
      ogtt_30min: bloodChemistry.ogtt30min,
      ogtt_1hr: bloodChemistry.ogtt1hr,
      ogtt_2hr: bloodChemistry.ogtt2hr,
      ppbs_2hr: bloodChemistry.ppbs2hr,
      inor_phosphorus: bloodChemistry.inorPhosphorus,
    };
  }

  /**
   * Maps an array of BloodChemistry entities to BloodChemistryDtos
   */
  static bloodChemistryToDtoArray(bloodChemistries: BloodChemistry[]): BloodChemistryDto[] {
    return bloodChemistries.map((bloodChemistry) => this.bloodChemistryToDto(bloodChemistry));
  }

  /**
   * Maps a CreateLabRequestRequestDto to test selections Map
   */
  static createLabRequestDtoToTestSelections(dto: CreateLabRequestRequestDto): Map<TestTypeName, string> {
    const testSelections = new Map<TestTypeName, string>();

    if (dto.cbc_with_platelet) testSelections.set('cbc_with_platelet', dto.cbc_with_platelet);
    if (dto.pregnancy_test) testSelections.set('pregnancy_test', dto.pregnancy_test);
    if (dto.urinalysis) testSelections.set('urinalysis', dto.urinalysis);
    if (dto.fecalysis) testSelections.set('fecalysis', dto.fecalysis);
    if (dto.occult_blood_test) testSelections.set('occult_blood_test', dto.occult_blood_test);
    if (dto.hepa_b_screening) testSelections.set('hepa_b_screening', dto.hepa_b_screening);
    if (dto.hepa_a_screening) testSelections.set('hepa_a_screening', dto.hepa_a_screening);
    if (dto.hepatitis_profile) testSelections.set('hepatitis_profile', dto.hepatitis_profile);
    if (dto.vdrl_rpr) testSelections.set('vdrl_rpr', dto.vdrl_rpr);
    if (dto.dengue_ns1) testSelections.set('dengue_ns1', dto.dengue_ns1);
    if (dto.ca_125_cea_psa) testSelections.set('ca_125_cea_psa', dto.ca_125_cea_psa);
    if (dto.fbs) testSelections.set('fbs', dto.fbs);
    if (dto.bun) testSelections.set('bun', dto.bun);
    if (dto.creatinine) testSelections.set('creatinine', dto.creatinine);
    if (dto.blood_uric_acid) testSelections.set('blood_uric_acid', dto.blood_uric_acid);
    if (dto.lipid_profile) testSelections.set('lipid_profile', dto.lipid_profile);
    if (dto.sgot) testSelections.set('sgot', dto.sgot);
    if (dto.sgpt) testSelections.set('sgpt', dto.sgpt);
    if (dto.alp) testSelections.set('alp', dto.alp);
    if (dto.sodium_na) testSelections.set('sodium_na', dto.sodium_na);
    if (dto.potassium_k) testSelections.set('potassium_k', dto.potassium_k);
    if (dto.hbalc) testSelections.set('hbalc', dto.hbalc);
    if (dto.ecg) testSelections.set('ecg', dto.ecg);
    if (dto.t3) testSelections.set('t3', dto.t3);
    if (dto.t4) testSelections.set('t4', dto.t4);
    if (dto.ft3) testSelections.set('ft3', dto.ft3);
    if (dto.ft4) testSelections.set('ft4', dto.ft4);
    if (dto.tsh) testSelections.set('tsh', dto.tsh);

    return testSelections;
  }

  /**
   * Maps CreateBloodChemistryRequestDto to BloodChemistry constructor parameters
   */
  static createBloodChemistryDtoToResults(dto: CreateBloodChemistryRequestDto) {
    return {
      fbs: dto.fbs,
      bun: dto.bun,
      creatinine: dto.creatinine,
      uricAcid: dto.uric_acid,
      cholesterol: dto.cholesterol,
      triglycerides: dto.triglycerides,
      hdl: dto.hdl,
      ldl: dto.ldl,
      vldl: dto.vldl,
      sodium: dto.sodium,
      potassium: dto.potassium,
      chloride: dto.chloride,
      calcium: dto.calcium,
      sgot: dto.sgot,
      sgpt: dto.sgpt,
      rbs: dto.rbs,
      alkPhosphatase: dto.alk_phosphatase,
      totalProtein: dto.total_protein,
      albumin: dto.albumin,
      globulin: dto.globulin,
      agRatio: dto.ag_ratio,
      totalBilirubin: dto.total_bilirubin,
      directBilirubin: dto.direct_bilirubin,
      indirectBilirubin: dto.indirect_bilirubin,
      ionisedCalcium: dto.ionised_calcium,
      magnesium: dto.magnesium,
      hba1c: dto.hbalc,
      ogtt30min: dto.ogtt_30min,
      ogtt1hr: dto.ogtt_1hr,
      ogtt2hr: dto.ogtt_2hr,
      ppbs2hr: dto.ppbs_2hr,
      inorPhosphorus: dto.inor_phosphorus,
    };
  }

  /**
   * Converts plain object to LabRequest for ORM mapping
   */
  static toPlainObject(labRequest: LabRequest): Record<string, any> {
    const selectedTests = labRequest.selectedTests;
    const testResults = labRequest.testResults;

    return {
      id: labRequest.id?.value,
      patient_id: labRequest.patientIdValue,
      patient_name: labRequest.patientName,
      age_gender: labRequest.ageGender,
      request_date: labRequest.requestDate,
      status: labRequest.status.status,
      others: labRequest.others,
      date_taken: labRequest.dateTaken,
      created_at: labRequest.createdAt,
      
      // Test selections and results
      cbc_with_platelet: testResults.get('cbc_with_platelet') || selectedTests.get('cbc_with_platelet') || '',
      pregnancy_test: testResults.get('pregnancy_test') || selectedTests.get('pregnancy_test') || '',
      urinalysis: testResults.get('urinalysis') || selectedTests.get('urinalysis') || '',
      fecalysis: testResults.get('fecalysis') || selectedTests.get('fecalysis') || '',
      occult_blood_test: testResults.get('occult_blood_test') || selectedTests.get('occult_blood_test') || '',
      hepa_b_screening: testResults.get('hepa_b_screening') || selectedTests.get('hepa_b_screening') || '',
      hepa_a_screening: testResults.get('hepa_a_screening') || selectedTests.get('hepa_a_screening') || '',
      hepatitis_profile: testResults.get('hepatitis_profile') || selectedTests.get('hepatitis_profile') || '',
      vdrl_rpr: testResults.get('vdrl_rpr') || selectedTests.get('vdrl_rpr') || '',
      dengue_ns1: testResults.get('dengue_ns1') || selectedTests.get('dengue_ns1') || '',
      ca_125_cea_psa: testResults.get('ca_125_cea_psa') || selectedTests.get('ca_125_cea_psa') || '',
      fbs: testResults.get('fbs') || selectedTests.get('fbs') || '',
      bun: testResults.get('bun') || selectedTests.get('bun') || '',
      creatinine: testResults.get('creatinine') || selectedTests.get('creatinine') || '',
      blood_uric_acid: testResults.get('blood_uric_acid') || selectedTests.get('blood_uric_acid') || '',
      lipid_profile: testResults.get('lipid_profile') || selectedTests.get('lipid_profile') || '',
      sgot: testResults.get('sgot') || selectedTests.get('sgot') || '',
      sgpt: testResults.get('sgpt') || selectedTests.get('sgpt') || '',
      alp: testResults.get('alp') || selectedTests.get('alp') || '',
      sodium_na: testResults.get('sodium_na') || selectedTests.get('sodium_na') || '',
      potassium_k: testResults.get('potassium_k') || selectedTests.get('potassium_k') || '',
      hbalc: testResults.get('hbalc') || selectedTests.get('hbalc') || '',
      ecg: testResults.get('ecg') || selectedTests.get('ecg') || '',
      t3: testResults.get('t3') || selectedTests.get('t3') || '',
      t4: testResults.get('t4') || selectedTests.get('t4') || '',
      ft3: testResults.get('ft3') || selectedTests.get('ft3') || '',
      ft4: testResults.get('ft4') || selectedTests.get('ft4') || '',
      tsh: testResults.get('tsh') || selectedTests.get('tsh') || '',
    };
  }

  /**
   * Creates LabRequest from plain object (for ORM mapping)
   */
  static fromPlainObject(obj: Record<string, any>): LabRequest {
    const selectedTests = new Map<TestTypeName, string>();
    const testResults = new Map<TestTypeName, string>();

    // Map test fields to appropriate collections
    if (obj.cbc_with_platelet) selectedTests.set('cbc_with_platelet', obj.cbc_with_platelet);
    if (obj.pregnancy_test) selectedTests.set('pregnancy_test', obj.pregnancy_test);
    if (obj.urinalysis) selectedTests.set('urinalysis', obj.urinalysis);
    if (obj.fecalysis) selectedTests.set('fecalysis', obj.fecalysis);
    if (obj.occult_blood_test) selectedTests.set('occult_blood_test', obj.occult_blood_test);
    if (obj.hepa_b_screening) selectedTests.set('hepa_b_screening', obj.hepa_b_screening);
    if (obj.hepa_a_screening) selectedTests.set('hepa_a_screening', obj.hepa_a_screening);
    if (obj.hepatitis_profile) selectedTests.set('hepatitis_profile', obj.hepatitis_profile);
    if (obj.vdrl_rpr) selectedTests.set('vdrl_rpr', obj.vdrl_rpr);
    if (obj.dengue_ns1) selectedTests.set('dengue_ns1', obj.dengue_ns1);
    if (obj.ca_125_cea_psa) selectedTests.set('ca_125_cea_psa', obj.ca_125_cea_psa);
    if (obj.fbs) selectedTests.set('fbs', obj.fbs);
    if (obj.bun) selectedTests.set('bun', obj.bun);
    if (obj.creatinine) selectedTests.set('creatinine', obj.creatinine);
    if (obj.blood_uric_acid) selectedTests.set('blood_uric_acid', obj.blood_uric_acid);
    if (obj.lipid_profile) selectedTests.set('lipid_profile', obj.lipid_profile);
    if (obj.sgot) selectedTests.set('sgot', obj.sgot);
    if (obj.sgpt) selectedTests.set('sgpt', obj.sgpt);
    if (obj.alp) selectedTests.set('alp', obj.alp);
    if (obj.sodium_na) selectedTests.set('sodium_na', obj.sodium_na);
    if (obj.potassium_k) selectedTests.set('potassium_k', obj.potassium_k);
    if (obj.hbalc) selectedTests.set('hbalc', obj.hbalc);
    if (obj.ecg) selectedTests.set('ecg', obj.ecg);
    if (obj.t3) selectedTests.set('t3', obj.t3);
    if (obj.t4) selectedTests.set('t4', obj.t4);
    if (obj.ft3) selectedTests.set('ft3', obj.ft3);
    if (obj.ft4) selectedTests.set('ft4', obj.ft4);
    if (obj.tsh) selectedTests.set('tsh', obj.tsh);

    return new LabRequest(
      obj.patient_id,
      obj.patient_name,
      obj.age_gender,
      obj.request_date instanceof Date ? obj.request_date : new Date(obj.request_date),
      selectedTests,
      obj.status ? { status: obj.status } as any : undefined,
      obj.others,
      testResults,
      obj.date_taken ? (obj.date_taken instanceof Date ? obj.date_taken : new Date(obj.date_taken)) : undefined,
      obj.id,
      obj.created_at instanceof Date ? obj.created_at : new Date(obj.created_at)
    );
  }
}