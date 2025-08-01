import { InvalidLabStatusException } from '../exceptions/DomainExceptions';

/**
 * Type representing possible lab request statuses
 */
export type LabStatusType = 'Pending' | 'In Progress' | 'Complete' | 'Cancelled';

/**
 * Value Object for Laboratory Status
 * Encapsulates business rules for lab request status management
 */
export class LabStatus {
  private readonly _status: LabStatusType;

  private static readonly VALID_STATUSES: LabStatusType[] = [
    'Pending',
    'In Progress', 
    'Complete',
    'Cancelled'
  ];

  constructor(status: LabStatusType) {
    this.validateStatus(status);
    this._status = status;
  }

  get status(): LabStatusType {
    return this._status;
  }

  private validateStatus(status: LabStatusType): void {
    if (!LabStatus.VALID_STATUSES.includes(status)) {
      throw new InvalidLabStatusException(`Invalid lab status: ${status}`);
    }
  }

  equals(other: LabStatus): boolean {
    return this._status === other._status;
  }

  toString(): string {
    return this._status;
  }

  static fromString(status: LabStatusType): LabStatus {
    return new LabStatus(status);
  }

  static pending(): LabStatus {
    return new LabStatus('Pending');
  }

  static inProgress(): LabStatus {
    return new LabStatus('In Progress');
  }

  static complete(): LabStatus {
    return new LabStatus('Complete');
  }

  static cancelled(): LabStatus {
    return new LabStatus('Cancelled');
  }

  isPending(): boolean {
    return this._status === 'Pending';
  }

  isInProgress(): boolean {
    return this._status === 'In Progress';
  }

  isComplete(): boolean {
    return this._status === 'Complete';
  }

  isCancelled(): boolean {
    return this._status === 'Cancelled';
  }

  canTransitionTo(newStatus: LabStatus): boolean {
    const transitions: Record<LabStatusType, LabStatusType[]> = {
      'Pending': ['In Progress', 'Cancelled'],
      'In Progress': ['Complete', 'Cancelled'],
      'Complete': [], // Cannot transition from Complete
      'Cancelled': [] // Cannot transition from Cancelled
    };

    return transitions[this._status].includes(newStatus._status);
  }
}