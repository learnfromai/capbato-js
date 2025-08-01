import { LabRequestId } from '../value-objects/LabRequestId';
import { PatientName } from '../value-objects/PatientName';
import { PatientId } from '../value-objects/PatientId';
import { AgeGender } from '../value-objects/AgeGender';
import { LabTestType } from '../value-objects/LabTestType';

interface ILabRequest {
  id?: LabRequestId;
  patientId: PatientId;
  patientName: PatientName;
  ageGender: AgeGender;
  requestDate: Date;
  others?: string;
  tests: Map<string, LabTestType>;
  status: 'Pending' | 'In Progress' | 'Complete';
  dateTaken?: Date;
}

export class LabRequest implements ILabRequest {
  private readonly _id?: LabRequestId;
  private readonly _patientId: PatientId;
  private readonly _patientName: PatientName;
  private readonly _ageGender: AgeGender;
  private readonly _requestDate: Date;
  private readonly _others?: string;
  private readonly _tests: Map<string, LabTestType>;
  private readonly _status: 'Pending' | 'In Progress' | 'Complete';
  private readonly _dateTaken?: Date;

  constructor(
    patientId: string | PatientId,
    patientName: string | PatientName,
    ageGender: string | AgeGender,
    requestDate: Date,
    tests: Record<string, string> = {},
    id?: string | LabRequestId,
    others?: string,
    status: 'Pending' | 'In Progress' | 'Complete' = 'Pending',
    dateTaken?: Date
  ) {
    this._patientId = patientId instanceof PatientId ? patientId : new PatientId(patientId);
    this._patientName = patientName instanceof PatientName ? patientName : new PatientName(patientName);
    this._ageGender = ageGender instanceof AgeGender ? ageGender : new AgeGender(ageGender);
    this._id = id instanceof LabRequestId ? id : id ? new LabRequestId(id) : undefined;
    this._requestDate = requestDate;
    this._others = others;
    this._status = status;
    this._dateTaken = dateTaken;

    // Convert tests object to Map with LabTestType values
    this._tests = new Map();
    Object.entries(tests).forEach(([testName, testValue]) => {
      if (testValue && testValue.toLowerCase() !== 'no') {
        this._tests.set(testName, new LabTestType(testName, testValue));
      }
    });
  }

  get id(): LabRequestId | undefined {
    return this._id;
  }

  get patientId(): PatientId {
    return this._patientId;
  }

  get patientName(): PatientName {
    return this._patientName;
  }

  get ageGender(): AgeGender {
    return this._ageGender;
  }

  get requestDate(): Date {
    return this._requestDate;
  }

  get others(): string | undefined {
    return this._others;
  }

  get tests(): Map<string, LabTestType> {
    return new Map(this._tests);
  }

  get status(): 'Pending' | 'In Progress' | 'Complete' {
    return this._status;
  }

  get dateTaken(): Date | undefined {
    return this._dateTaken;
  }

  // For backwards compatibility with existing code that expects string ID
  get stringId(): string | undefined {
    return this._id?.value;
  }

  get patientIdValue(): string {
    return this._patientId.value;
  }

  get patientNameValue(): string {
    return this._patientName.value;
  }

  get ageGenderValue(): string {
    return this._ageGender.value;
  }

  // Domain business logic methods
  updateStatus(status: 'Pending' | 'In Progress' | 'Complete'): LabRequest {
    return this.createCopy({ status });
  }

  addTestResult(testName: string, result: string): LabRequest {
    const newTests = new Map(this._tests);
    newTests.set(testName, new LabTestType(testName, result));
    return this.createCopy({ tests: newTests });
  }

  updateTestResults(testResults: Record<string, string>): LabRequest {
    const newTests = new Map(this._tests);
    Object.entries(testResults).forEach(([testName, result]) => {
      if (result && result.trim()) {
        newTests.set(testName, new LabTestType(testName, result));
      }
    });
    return this.createCopy({ tests: newTests });
  }

  markAsComplete(dateTaken?: Date): LabRequest {
    return this.createCopy({ 
      status: 'Complete',
      dateTaken: dateTaken || new Date()
    });
  }

  /**
   * Creates a copy of this lab request with modified properties
   * Immutable entity pattern - all changes create new instances
   */
  private createCopy(updates: {
    status?: 'Pending' | 'In Progress' | 'Complete';
    tests?: Map<string, LabTestType>;
    dateTaken?: Date;
  }): LabRequest {
    const testsRecord: Record<string, string> = {};
    const testsToUse = updates.tests || this._tests;
    testsToUse.forEach((labTest, testName) => {
      testsRecord[testName] = labTest.value;
    });

    return new LabRequest(
      this._patientId,
      this._patientName,
      this._ageGender,
      this._requestDate,
      testsRecord,
      this._id,
      this._others,
      updates.status !== undefined ? updates.status : this._status,
      updates.dateTaken !== undefined ? updates.dateTaken : this._dateTaken
    );
  }

  /**
   * Validates business rules
   */
  canBeCompleted(): boolean {
    return this._status !== 'Complete';
  }

  hasTest(testName: string): boolean {
    return this._tests.has(testName);
  }

  getTestValue(testName: string): string | undefined {
    return this._tests.get(testName)?.value;
  }

  getSelectedTests(): string[] {
    return Array.from(this._tests.keys());
  }

  /**
   * Domain equality comparison based on business identity
   */
  equals(other: LabRequest): boolean {
    if (!this._id || !other._id) {
      return false;
    }
    return this._id.equals(other._id);
  }

  /**
   * Validates business invariants
   */
  validate(): void {
    if (!this._patientId || !this._patientId.value.trim()) {
      throw new Error('Lab request must have a valid patient ID');
    }

    if (!this._patientName || !this._patientName.value.trim()) {
      throw new Error('Lab request must have a valid patient name');
    }

    if (!this._ageGender || !this._ageGender.value.trim()) {
      throw new Error('Lab request must have valid age and gender information');
    }

    if (this._tests.size === 0) {
      throw new Error('Lab request must have at least one test selected');
    }

    if (this._dateTaken && this._dateTaken < this._requestDate) {
      throw new Error('Date taken cannot be before request date');
    }
  }
}

export type { ILabRequest };