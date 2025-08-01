import { LabRequestId } from '../value-objects/LabRequestId';
import { PatientId } from '../value-objects/PatientId';
import { TestType, TestTypeName } from '../value-objects/TestType';
import { LabStatus } from '../value-objects/LabStatus';
import {
  InvalidPatientNameException,
  InvalidStatusTransitionException,
  InvalidTestResultException,
} from '../exceptions/DomainExceptions';

interface ILabRequest {
  id?: LabRequestId;
  patientId: PatientId;
  patientName: string;
  ageGender: string;
  requestDate: Date;
  status: LabStatus;
  others?: string;
  selectedTests: Map<TestTypeName, string>;
  testResults: Map<TestTypeName, string>;
  dateTaken?: Date;
  createdAt: Date;
}

export class LabRequest implements ILabRequest {
  private readonly _id?: LabRequestId;
  private readonly _patientId: PatientId;
  private readonly _patientName: string;
  private readonly _ageGender: string;
  private readonly _requestDate: Date;
  private readonly _status: LabStatus;
  private readonly _others?: string;
  private readonly _selectedTests: Map<TestTypeName, string>;
  private readonly _testResults: Map<TestTypeName, string>;
  private readonly _dateTaken?: Date;
  private readonly _createdAt: Date;

  constructor(
    patientId: string | PatientId,
    patientName: string,
    ageGender: string,
    requestDate: Date,
    selectedTests: Map<TestTypeName, string> = new Map(),
    status: LabStatus = LabStatus.pending(),
    others?: string,
    testResults: Map<TestTypeName, string> = new Map(),
    dateTaken?: Date,
    id?: string | LabRequestId,
    createdAt: Date = new Date()
  ) {
    this.validatePatientName(patientName);
    this.validateAgeGender(ageGender);

    this._patientId = patientId instanceof PatientId ? patientId : new PatientId(patientId);
    this._patientName = patientName.trim();
    this._ageGender = ageGender.trim();
    this._requestDate = requestDate;
    this._status = status;
    this._others = others?.trim();
    this._selectedTests = new Map(selectedTests);
    this._testResults = new Map(testResults);
    this._dateTaken = dateTaken;
    this._id = id instanceof LabRequestId ? id : id ? new LabRequestId(id) : undefined;
    this._createdAt = createdAt;
  }

  // Getters
  get id(): LabRequestId | undefined {
    return this._id;
  }

  get patientId(): PatientId {
    return this._patientId;
  }

  get patientName(): string {
    return this._patientName;
  }

  get ageGender(): string {
    return this._ageGender;
  }

  get requestDate(): Date {
    return this._requestDate;
  }

  get status(): LabStatus {
    return this._status;
  }

  get others(): string | undefined {
    return this._others;
  }

  get selectedTests(): Map<TestTypeName, string> {
    return new Map(this._selectedTests);
  }

  get testResults(): Map<TestTypeName, string> {
    return new Map(this._testResults);
  }

  get dateTaken(): Date | undefined {
    return this._dateTaken;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  // For backwards compatibility
  get stringId(): string | undefined {
    return this._id?.value;
  }

  get patientIdValue(): string {
    return this._patientId.value;
  }

  // Domain business logic methods
  updateStatus(newStatus: LabStatus): LabRequest {
    if (!this._status.canTransitionTo(newStatus)) {
      throw new InvalidStatusTransitionException(
        this._status.status,
        newStatus.status
      );
    }

    return this.createCopy({ status: newStatus });
  }

  addTestResult(testType: TestTypeName, result: string): LabRequest {
    this.validateTestResult(result);

    // Check if the test was actually requested
    if (!this._selectedTests.has(testType)) {
      throw new InvalidTestResultException(`Test ${testType} was not requested`);
    }

    const newResults = new Map(this._testResults);
    newResults.set(testType, result.trim());

    return this.createCopy({ testResults: newResults });
  }

  addMultipleTestResults(results: Map<TestTypeName, string>): LabRequest {
    let updatedRequest: LabRequest = this;

    for (const [testType, result] of results) {
      updatedRequest = updatedRequest.addTestResult(testType, result);
    }

    return updatedRequest;
  }

  completeWithResults(
    results: Map<TestTypeName, string>,
    dateTaken: Date = new Date()
  ): LabRequest {
    const updatedRequest = this.addMultipleTestResults(results);
    
    return updatedRequest.createCopy({ 
      status: LabStatus.complete(),
      dateTaken 
    });
  }

  cancel(): LabRequest {
    return this.updateStatus(LabStatus.cancelled());
  }

  startProcessing(): LabRequest {
    return this.updateStatus(LabStatus.inProgress());
  }

  // Validation methods
  private validatePatientName(name: string): void {
    if (!name || !name.trim()) {
      throw new InvalidPatientNameException('cannot be empty');
    }

    if (name.trim().length > 255) {
      throw new InvalidPatientNameException('cannot exceed 255 characters');
    }

    if (name.trim().length < 2) {
      throw new InvalidPatientNameException('must be at least 2 characters long');
    }
  }

  private validateAgeGender(ageGender: string): void {
    if (!ageGender || !ageGender.trim()) {
      throw new InvalidPatientNameException('Age/Gender cannot be empty');
    }

    if (ageGender.trim().length > 50) {
      throw new InvalidPatientNameException('Age/Gender cannot exceed 50 characters');
    }
  }

  private validateTestResult(result: string): void {
    if (!result || !result.trim()) {
      throw new InvalidTestResultException('cannot be empty');
    }

    if (result.trim().length > 500) {
      throw new InvalidTestResultException('cannot exceed 500 characters');
    }
  }

  /**
   * Creates a copy of this lab request with modified properties
   * Immutable entity pattern - all changes create new instances
   */
  private createCopy(updates: {
    status?: LabStatus;
    testResults?: Map<TestTypeName, string>;
    dateTaken?: Date;
    others?: string;
  }): LabRequest {
    return new LabRequest(
      this._patientId,
      this._patientName,
      this._ageGender,
      this._requestDate,
      this._selectedTests,
      updates.status || this._status,
      updates.others !== undefined ? updates.others : this._others,
      updates.testResults || this._testResults,
      updates.dateTaken !== undefined ? updates.dateTaken : this._dateTaken,
      this._id,
      this._createdAt
    );
  }

  // Query methods
  hasTestResult(testType: TestTypeName): boolean {
    return this._testResults.has(testType) && 
           this._testResults.get(testType) !== undefined &&
           this._testResults.get(testType)!.trim() !== '';
  }

  isTestRequested(testType: TestTypeName): boolean {
    return this._selectedTests.has(testType) && 
           this._selectedTests.get(testType) !== undefined &&
           this._selectedTests.get(testType)!.toLowerCase() !== 'no';
  }

  getRequestedTestTypes(): TestType[] {
    const requestedTypes: TestType[] = [];
    
    for (const [testType, value] of this._selectedTests) {
      if (value && value.toLowerCase() !== 'no') {
        requestedTypes.push(new TestType(testType));
      }
    }

    return requestedTypes;
  }

  getCompletedTestTypes(): TestType[] {
    const completedTypes: TestType[] = [];
    
    for (const [testType] of this._testResults) {
      if (this.hasTestResult(testType)) {
        completedTypes.push(new TestType(testType));
      }
    }

    return completedTypes;
  }

  isAllTestsCompleted(): boolean {
    const requestedTests = this.getRequestedTestTypes();
    const completedTests = this.getCompletedTestTypes();
    
    return requestedTests.length > 0 && 
           requestedTests.every(requested => 
             completedTests.some(completed => completed.equals(requested))
           );
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
    if (!this._patientName || this._patientName.trim().length === 0) {
      throw new Error('Lab request must have a valid patient name');
    }

    if (!this._ageGender || this._ageGender.trim().length === 0) {
      throw new Error('Lab request must have valid age/gender information');
    }

    if (this._selectedTests.size === 0) {
      throw new Error('Lab request must have at least one test selected');
    }

    if (this._requestDate > new Date()) {
      throw new Error('Request date cannot be in the future');
    }

    if (this._dateTaken && this._dateTaken < this._requestDate) {
      throw new Error('Date taken cannot be before request date');
    }

    if (this._status.isComplete() && !this._dateTaken) {
      throw new Error('Completed lab requests must have a date taken');
    }
  }
}

export type { ILabRequest };