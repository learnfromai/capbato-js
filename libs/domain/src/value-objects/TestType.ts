import { InvalidTestTypeException } from '../exceptions/DomainExceptions';

/**
 * Type representing possible test types
 */
export type TestTypeName = 
  | 'cbc_with_platelet'
  | 'pregnancy_test'
  | 'urinalysis'
  | 'fecalysis'
  | 'occult_blood_test'
  | 'hepa_b_screening'
  | 'hepa_a_screening'
  | 'hepatitis_profile'
  | 'vdrl_rpr'
  | 'dengue_ns1'
  | 'ca_125_cea_psa'
  | 'fbs'
  | 'bun'
  | 'creatinine'
  | 'blood_uric_acid'
  | 'lipid_profile'
  | 'sgot'
  | 'sgpt'
  | 'alp'
  | 'sodium_na'
  | 'potassium_k'
  | 'hbalc'
  | 'ecg'
  | 't3'
  | 't4'
  | 'ft3'
  | 'ft4'
  | 'tsh';

/**
 * Value Object for Test Type
 * Encapsulates business rules and display names for laboratory test types
 */
export class TestType {
  private readonly _name: TestTypeName;
  private readonly _displayName: string;

  private static readonly TEST_DISPLAY_NAMES: Record<TestTypeName, string> = {
    cbc_with_platelet: 'CBC with Platelet',
    pregnancy_test: 'Pregnancy Test',
    urinalysis: 'Urinalysis',
    fecalysis: 'Fecalysis',
    occult_blood_test: 'Occult Blood Test',
    hepa_b_screening: 'Hepa B Screening',
    hepa_a_screening: 'Hepa A Screening',
    hepatitis_profile: 'Hepatitis Profile',
    vdrl_rpr: 'VDRL/RPR',
    dengue_ns1: 'Dengue NS1',
    ca_125_cea_psa: 'CA 125 / CEA / PSA',
    fbs: 'FBS',
    bun: 'BUN',
    creatinine: 'Creatinine',
    blood_uric_acid: 'Blood Uric Acid',
    lipid_profile: 'Lipid Profile',
    sgot: 'SGOT',
    sgpt: 'SGPT',
    alp: 'ALP',
    sodium_na: 'Sodium Na',
    potassium_k: 'Potassium K+',
    hbalc: 'HBA1C',
    ecg: 'ECG',
    t3: 'T3',
    t4: 'T4',
    ft3: 'FT3',
    ft4: 'FT4',
    tsh: 'TSH'
  };

  constructor(name: TestTypeName) {
    this.validateTestType(name);
    this._name = name;
    this._displayName = TestType.TEST_DISPLAY_NAMES[name];
  }

  get name(): TestTypeName {
    return this._name;
  }

  get displayName(): string {
    return this._displayName;
  }

  private validateTestType(name: TestTypeName): void {
    if (!TestType.TEST_DISPLAY_NAMES[name]) {
      throw new InvalidTestTypeException(`Unknown test type: ${name}`);
    }
  }

  equals(other: TestType): boolean {
    return this._name === other._name;
  }

  toString(): string {
    return this._displayName;
  }

  static fromString(name: TestTypeName): TestType {
    return new TestType(name);
  }

  static getAllTestTypes(): TestType[] {
    return Object.keys(TestType.TEST_DISPLAY_NAMES).map(
      (name) => new TestType(name as TestTypeName)
    );
  }
}