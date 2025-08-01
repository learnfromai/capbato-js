import { DomainException } from '../exceptions/DomainExceptions';

export type AppointmentStatusType = 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';

export class AppointmentStatus {
  private readonly _value: AppointmentStatusType;

  private static readonly VALID_STATUSES: AppointmentStatusType[] = [
    'scheduled', 
    'confirmed', 
    'cancelled', 
    'completed', 
    'no-show'
  ];

  constructor(value: AppointmentStatusType) {
    if (!AppointmentStatus.VALID_STATUSES.includes(value)) {
      throw new DomainException(
        `Invalid appointment status: ${value}. Valid statuses are: ${AppointmentStatus.VALID_STATUSES.join(', ')}`,
        'INVALID_APPOINTMENT_STATUS'
      );
    }

    this._value = value;
  }

  get value(): AppointmentStatusType {
    return this._value;
  }

  equals(other: AppointmentStatus): boolean {
    return this._value === other._value;
  }

  isConfirmed(): boolean {
    return this._value === 'confirmed';
  }

  isCancelled(): boolean {
    return this._value === 'cancelled';
  }

  isCompleted(): boolean {
    return this._value === 'completed';
  }

  isScheduled(): boolean {
    return this._value === 'scheduled';
  }

  canBeUpdated(): boolean {
    return this._value !== 'cancelled' && this._value !== 'completed';
  }

  toString(): string {
    return this._value;
  }
}