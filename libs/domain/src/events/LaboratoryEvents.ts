/**
 * Base domain event interface
 */
export interface DomainEvent {
  readonly eventId: string;
  readonly eventType: string;
  readonly occurredOn: Date;
  readonly aggregateId: string;
}

/**
 * Laboratory-related domain events
 */
export class LabRequestCreatedEvent implements DomainEvent {
  readonly eventId: string;
  readonly eventType = 'LabRequestCreated';
  readonly occurredOn: Date;
  readonly aggregateId: string;

  constructor(
    public readonly labRequestId: string,
    public readonly patientId: string,
    public readonly patientName: string,
    public readonly requestedTests: string[],
    public readonly urgencyLevel: string
  ) {
    this.eventId = `lab-request-created-${Date.now()}-${Math.random()}`;
    this.occurredOn = new Date();
    this.aggregateId = labRequestId;
  }
}

export class LabRequestStatusChangedEvent implements DomainEvent {
  readonly eventId: string;
  readonly eventType = 'LabRequestStatusChanged';
  readonly occurredOn: Date;
  readonly aggregateId: string;

  constructor(
    public readonly labRequestId: string,
    public readonly patientId: string,
    public readonly oldStatus: string,
    public readonly newStatus: string,
    public readonly changedBy?: string
  ) {
    this.eventId = `lab-status-changed-${Date.now()}-${Math.random()}`;
    this.occurredOn = new Date();
    this.aggregateId = labRequestId;
  }
}

export class LabRequestCompletedEvent implements DomainEvent {
  readonly eventId: string;
  readonly eventType = 'LabRequestCompleted';
  readonly occurredOn: Date;
  readonly aggregateId: string;

  constructor(
    public readonly labRequestId: string,
    public readonly patientId: string,
    public readonly patientName: string,
    public readonly completedTests: string[],
    public readonly dateTaken: Date,
    public readonly hasAbnormalResults: boolean
  ) {
    this.eventId = `lab-request-completed-${Date.now()}-${Math.random()}`;
    this.occurredOn = new Date();
    this.aggregateId = labRequestId;
  }
}

export class BloodChemistryResultsAddedEvent implements DomainEvent {
  readonly eventId: string;
  readonly eventType = 'BloodChemistryResultsAdded';
  readonly occurredOn: Date;
  readonly aggregateId: string;

  constructor(
    public readonly bloodChemistryId: string,
    public readonly patientName: string,
    public readonly age: number,
    public readonly sex: string,
    public readonly dateTaken: Date,
    public readonly hasAbnormalResults: boolean,
    public readonly abnormalityWarnings: string[]
  ) {
    this.eventId = `blood-chemistry-added-${Date.now()}-${Math.random()}`;
    this.occurredOn = new Date();
    this.aggregateId = bloodChemistryId;
  }
}

export class LabRequestCancelledEvent implements DomainEvent {
  readonly eventId: string;
  readonly eventType = 'LabRequestCancelled';
  readonly occurredOn: Date;
  readonly aggregateId: string;

  constructor(
    public readonly labRequestId: string,
    public readonly patientId: string,
    public readonly reason?: string,
    public readonly cancelledBy?: string
  ) {
    this.eventId = `lab-request-cancelled-${Date.now()}-${Math.random()}`;
    this.occurredOn = new Date();
    this.aggregateId = labRequestId;
  }
}

export class TestResultsUpdatedEvent implements DomainEvent {
  readonly eventId: string;
  readonly eventType = 'TestResultsUpdated';
  readonly occurredOn: Date;
  readonly aggregateId: string;

  constructor(
    public readonly labRequestId: string,
    public readonly patientId: string,
    public readonly updatedTests: Record<string, string>,
    public readonly completionPercentage: number
  ) {
    this.eventId = `test-results-updated-${Date.now()}-${Math.random()}`;
    this.occurredOn = new Date();
    this.aggregateId = labRequestId;
  }
}