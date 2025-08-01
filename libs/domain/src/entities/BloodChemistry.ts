import { BloodChemistryId } from '../value-objects/BloodChemistryId';
import { PatientName } from '../value-objects/PatientName';
import { BloodChemValue } from '../value-objects/BloodChemValue';

interface IBloodChemistry {
  id?: BloodChemistryId;
  patientName: PatientName;
  age: number;
  sex: 'Male' | 'Female';
  dateTaken: Date;
  results: Map<string, BloodChemValue>;
}

export class BloodChemistry implements IBloodChemistry {
  private readonly _id?: BloodChemistryId;
  private readonly _patientName: PatientName;
  private readonly _age: number;
  private readonly _sex: 'Male' | 'Female';
  private readonly _dateTaken: Date;
  private readonly _results: Map<string, BloodChemValue>;

  constructor(
    patientName: string | PatientName,
    age: number,
    sex: 'Male' | 'Female',
    dateTaken: Date,
    results: Record<string, number | string> = {},
    id?: string | BloodChemistryId
  ) {
    this._patientName = patientName instanceof PatientName ? patientName : new PatientName(patientName);
    this._age = age;
    this._sex = sex;
    this._dateTaken = dateTaken;
    this._id = id instanceof BloodChemistryId ? id : id ? new BloodChemistryId(id) : undefined;

    // Convert results object to Map with BloodChemValue values
    this._results = new Map();
    Object.entries(results).forEach(([testName, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        this._results.set(testName, new BloodChemValue(testName, value));
      }
    });
  }

  get id(): BloodChemistryId | undefined {
    return this._id;
  }

  get patientName(): PatientName {
    return this._patientName;
  }

  get age(): number {
    return this._age;
  }

  get sex(): 'Male' | 'Female' {
    return this._sex;
  }

  get dateTaken(): Date {
    return this._dateTaken;
  }

  get results(): Map<string, BloodChemValue> {
    return new Map(this._results);
  }

  // For backwards compatibility with existing code that expects string ID
  get stringId(): string | undefined {
    return this._id?.value;
  }

  get patientNameValue(): string {
    return this._patientName.value;
  }

  // Domain business logic methods
  updateResult(testName: string, value: number | string): BloodChemistry {
    const newResults = new Map(this._results);
    newResults.set(testName, new BloodChemValue(testName, value));
    return this.createCopy({ results: newResults });
  }

  updateResults(newResults: Record<string, number | string>): BloodChemistry {
    const updatedResults = new Map(this._results);
    Object.entries(newResults).forEach(([testName, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        updatedResults.set(testName, new BloodChemValue(testName, value));
      }
    });
    return this.createCopy({ results: updatedResults });
  }

  /**
   * Creates a copy of this blood chemistry with modified properties
   * Immutable entity pattern - all changes create new instances
   */
  private createCopy(updates: {
    results?: Map<string, BloodChemValue>;
  }): BloodChemistry {
    const resultsRecord: Record<string, number | string> = {};
    const resultsToUse = updates.results || this._results;
    resultsToUse.forEach((bloodChemValue, testName) => {
      resultsRecord[testName] = bloodChemValue.value;
    });

    return new BloodChemistry(
      this._patientName,
      this._age,
      this._sex,
      this._dateTaken,
      resultsRecord,
      this._id
    );
  }

  hasResult(testName: string): boolean {
    return this._results.has(testName);
  }

  getResultValue(testName: string): number | string | undefined {
    return this._results.get(testName)?.value;
  }

  getResultsAsRecord(): Record<string, number | string> {
    const record: Record<string, number | string> = {};
    this._results.forEach((bloodChemValue, testName) => {
      record[testName] = bloodChemValue.value;
    });
    return record;
  }

  /**
   * Domain equality comparison based on business identity
   */
  equals(other: BloodChemistry): boolean {
    if (!this._id || !other._id) {
      return false;
    }
    return this._id.equals(other._id);
  }

  /**
   * Validates business invariants
   */
  validate(): void {
    if (!this._patientName || !this._patientName.value.trim()) {
      throw new Error('Blood chemistry must have a valid patient name');
    }

    if (this._age < 0 || this._age > 150) {
      throw new Error('Age must be between 0 and 150');
    }

    if (!['Male', 'Female'].includes(this._sex)) {
      throw new Error('Sex must be either Male or Female');
    }

    if (this._results.size === 0) {
      throw new Error('Blood chemistry must have at least one test result');
    }

    if (this._dateTaken > new Date()) {
      throw new Error('Date taken cannot be in the future');
    }
  }
}

export type { IBloodChemistry };