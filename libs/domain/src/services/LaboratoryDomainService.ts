import { LabRequest } from '../entities/LabRequest';
import { BloodChemistry } from '../entities/BloodChemistry';
import { TestTypeName } from '../value-objects/TestType';
import { LabStatus } from '../value-objects/LabStatus';

/**
 * Domain Service for Laboratory business logic
 * Contains domain logic that doesn't naturally belong to a single entity
 */
export class LaboratoryDomainService {
  /**
   * Determines if a lab request can be completed based on business rules
   */
  canCompleteLabRequest(labRequest: LabRequest): boolean {
    // Cannot complete if already complete or cancelled
    if (labRequest.status.isComplete() || labRequest.status.isCancelled()) {
      return false;
    }

    // Must have at least one test requested
    const requestedTests = labRequest.getRequestedTestTypes();
    if (requestedTests.length === 0) {
      return false;
    }

    // Can be completed with partial results if at least one test has results
    const completedTests = labRequest.getCompletedTestTypes();
    return completedTests.length > 0;
  }

  /**
   * Calculates completion percentage for a lab request
   */
  calculateCompletionPercentage(labRequest: LabRequest): number {
    const requestedTests = labRequest.getRequestedTestTypes();
    const completedTests = labRequest.getCompletedTestTypes();

    if (requestedTests.length === 0) {
      return 0;
    }

    const completedCount = requestedTests.filter(requested =>
      completedTests.some(completed => completed.equals(requested))
    ).length;

    return Math.round((completedCount / requestedTests.length) * 100);
  }

  /**
   * Determines urgency level based on test types and patient age
   */
  determineUrgencyLevel(labRequest: LabRequest): 'Low' | 'Medium' | 'High' | 'Critical' {
    const ageGender = labRequest.ageGender.toLowerCase();
    const requestedTests = labRequest.getRequestedTestTypes();

    // Critical: Emergency tests
    const criticalTests: TestTypeName[] = ['dengue_ns1', 'pregnancy_test'];
    if (requestedTests.some(test => criticalTests.includes(test.name))) {
      return 'Critical';
    }

    // High: Cardiac/liver markers, or elderly patients
    const highPriorityTests: TestTypeName[] = ['sgot', 'sgpt', 'creatinine', 'bun'];
    const isElderly = this.extractAge(ageGender) >= 65;
    
    if (isElderly || requestedTests.some(test => highPriorityTests.includes(test.name))) {
      return 'High';
    }

    // Medium: Multiple tests or metabolic tests
    const metabolicTests: TestTypeName[] = ['fbs', 'hbalc', 'lipid_profile'];
    if (requestedTests.length > 5 || 
        requestedTests.some(test => metabolicTests.includes(test.name))) {
      return 'Medium';
    }

    return 'Low';
  }

  /**
   * Validates if blood chemistry results are within expected ranges
   */
  validateBloodChemistryRanges(bloodChemistry: BloodChemistry): string[] {
    const warnings: string[] = [];

    // Glucose levels
    if (bloodChemistry.fbs !== undefined) {
      if (bloodChemistry.fbs < 70) {
        warnings.push('FBS below normal range (70-100 mg/dL)');
      } else if (bloodChemistry.fbs > 100) {
        warnings.push('FBS above normal range (70-100 mg/dL)');
      }
    }

    // Kidney function
    if (bloodChemistry.creatinine !== undefined && bloodChemistry.creatinine > 1.2) {
      warnings.push('Creatinine elevated (normal: 0.6-1.2 mg/dL)');
    }

    if (bloodChemistry.bun !== undefined) {
      if (bloodChemistry.bun < 7 || bloodChemistry.bun > 20) {
        warnings.push('BUN outside normal range (7-20 mg/dL)');
      }
    }

    // Liver function
    if (bloodChemistry.sgot !== undefined && bloodChemistry.sgot > 40) {
      warnings.push('SGOT elevated (normal: 8-40 U/L)');
    }

    if (bloodChemistry.sgpt !== undefined && bloodChemistry.sgpt > 41) {
      warnings.push('SGPT elevated (normal: 7-41 U/L)');
    }

    // Lipid profile
    if (bloodChemistry.cholesterol !== undefined && bloodChemistry.cholesterol > 200) {
      warnings.push('Total cholesterol elevated (normal: <200 mg/dL)');
    }

    if (bloodChemistry.hdl !== undefined && bloodChemistry.hdl < 40) {
      warnings.push('HDL cholesterol low (normal: >40 mg/dL)');
    }

    if (bloodChemistry.ldl !== undefined && bloodChemistry.ldl > 100) {
      warnings.push('LDL cholesterol elevated (normal: <100 mg/dL)');
    }

    if (bloodChemistry.triglycerides !== undefined && bloodChemistry.triglycerides > 150) {
      warnings.push('Triglycerides elevated (normal: <150 mg/dL)');
    }

    return warnings;
  }

  /**
   * Determines if follow-up testing is recommended
   */
  requiresFollowUp(bloodChemistry: BloodChemistry): boolean {
    const warnings = this.validateBloodChemistryRanges(bloodChemistry);
    return warnings.length > 0;
  }

  /**
   * Calculates estimated processing time based on test complexity
   */
  estimateProcessingTime(labRequest: LabRequest): number {
    const requestedTests = labRequest.getRequestedTestTypes();
    let totalMinutes = 0;

    const processingTimes: Record<TestTypeName, number> = {
      // Quick tests (15-30 minutes)
      'pregnancy_test': 15,
      'dengue_ns1': 20,
      'urinalysis': 25,
      'fecalysis': 30,
      
      // Moderate tests (30-60 minutes)
      'cbc_with_platelet': 45,
      'fbs': 30,
      'bun': 35,
      'creatinine': 35,
      'blood_uric_acid': 30,
      
      // Complex tests (60-120 minutes)
      'lipid_profile': 90,
      'sgot': 60,
      'sgpt': 60,
      'alp': 60,
      'hbalc': 120,
      
      // Specialized tests (60-180 minutes)
      'hepa_b_screening': 120,
      'hepa_a_screening': 120,
      'hepatitis_profile': 180,
      'vdrl_rpr': 90,
      'ca_125_cea_psa': 180,
      
      // Electrolytes (30-45 minutes)
      'sodium_na': 30,
      'potassium_k': 30,
      
      // Thyroid function (90-120 minutes)
      't3': 90,
      't4': 90,
      'ft3': 120,
      'ft4': 120,
      'tsh': 120,
      
      // Other tests
      'occult_blood_test': 45,
      'ecg': 15
    };

    for (const test of requestedTests) {
      totalMinutes += processingTimes[test.name] || 60; // Default 60 minutes
    }

    // Add overhead time for multiple tests
    if (requestedTests.length > 1) {
      totalMinutes += (requestedTests.length - 1) * 15; // 15 minutes overhead per additional test
    }

    return totalMinutes;
  }

  /**
   * Private helper to extract age from age/gender string
   */
  private extractAge(ageGender: string): number {
    const ageMatch = ageGender.match(/(\d+)/);
    return ageMatch ? parseInt(ageMatch[1], 10) : 0;
  }
}