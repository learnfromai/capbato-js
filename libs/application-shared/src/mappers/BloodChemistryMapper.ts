import type { BloodChemistry } from '@nx-starter/domain';
import type { BloodChemistryDto } from '../dto/LaboratoryDto';

/**
 * Mapper for BloodChemistry entity to/from DTOs
 * Handles data transformation between domain entities and API DTOs
 */
export class BloodChemistryMapper {
  /**
   * Convert BloodChemistry entity to DTO
   */
  static toDto(bloodChemistry: BloodChemistry): BloodChemistryDto {
    const results = bloodChemistry.getResultsAsRecord();
    
    return {
      id: bloodChemistry.stringId,
      patientName: bloodChemistry.patientNameValue,
      age: bloodChemistry.age,
      sex: bloodChemistry.sex,
      dateTaken: bloodChemistry.dateTaken.toISOString(),
      results,
      // Individual result fields for backward compatibility
      fbs: results.fbs,
      bun: results.bun,
      creatinine: results.creatinine,
      uricAcid: results.uric_acid,
      cholesterol: results.cholesterol,
      triglycerides: results.triglycerides,
      hdl: results.hdl,
      ldl: results.ldl,
      vldl: results.vldl,
      sodium: results.sodium,
      potassium: results.potassium,
      chloride: results.chloride,
      calcium: results.calcium,
      sgot: results.sgot,
      sgpt: results.sgpt,
      rbs: results.rbs,
      alkPhosphatase: results.alk_phosphatase,
      totalProtein: results.total_protein,
      albumin: results.albumin,
      globulin: results.globulin,
      agRatio: results.ag_ratio,
      totalBilirubin: results.total_bilirubin,
      directBilirubin: results.direct_bilirubin,
      indirectBilirubin: results.indirect_bilirubin,
      ionisedCalcium: results.ionised_calcium,
      magnesium: results.magnesium,
      hbalc: results.hbalc,
      ogtt30min: results.ogtt_30min,
      ogtt1hr: results.ogtt_1hr,
      ogtt2hr: results.ogtt_2hr,
      ppbs2hr: results.ppbs_2hr,
      inorPhosphorus: results.inor_phosphorus,
    };
  }

  /**
   * Convert array of BloodChemistry entities to DTOs
   */
  static toDtoArray(bloodChemistries: BloodChemistry[]): BloodChemistryDto[] {
    return bloodChemistries.map(this.toDto);
  }

  /**
   * Convert plain object from repository to BloodChemistry entity
   */
  static fromPlainObject(data: any): BloodChemistry {
    const results: Record<string, number | string> = {};
    
    // Extract result fields from the plain object
    const resultFields = [
      'fbs', 'bun', 'creatinine', 'uric_acid', 'cholesterol',
      'triglycerides', 'hdl', 'ldl', 'vldl', 'sodium',
      'potassium', 'chloride', 'calcium', 'sgot', 'sgpt',
      'rbs', 'alk_phosphatase', 'total_protein', 'albumin',
      'globulin', 'ag_ratio', 'total_bilirubin', 'direct_bilirubin',
      'indirect_bilirubin', 'ionised_calcium', 'magnesium',
      'hbalc', 'ogtt_30min', 'ogtt_1hr', 'ogtt_2hr', 'ppbs_2hr', 'inor_phosphorus'
    ];

    resultFields.forEach(field => {
      if (data[field] !== null && data[field] !== undefined && data[field] !== '') {
        results[field] = data[field];
      }
    });

    return new BloodChemistry(
      data.patient_name || data.patientName,
      data.age,
      data.sex,
      new Date(data.date_taken || data.dateTaken),
      results,
      data.id
    );
  }

  /**
   * Convert BloodChemistry entity to plain object for repository storage
   */
  static toPlainObject(bloodChemistry: BloodChemistry): any {
    const results = bloodChemistry.getResultsAsRecord();
    
    return {
      id: bloodChemistry.stringId,
      patient_name: bloodChemistry.patientNameValue,
      age: bloodChemistry.age,
      sex: bloodChemistry.sex,
      date_taken: bloodChemistry.dateTaken,
      // Individual result fields
      ...results
    };
  }
}