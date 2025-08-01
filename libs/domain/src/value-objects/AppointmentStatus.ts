export type AppointmentStatusType = 'scheduled' | 'confirmed' | 'completed' | 'cancelled';

/**
 * Value Object for Appointment Status
 * Manages the lifecycle of appointment statuses with business validation
 */
export class AppointmentStatus {
  private readonly _value: AppointmentStatusType;
  private static readonly VALID_STATUSES: AppointmentStatusType[] = [
    'scheduled',
    'confirmed', 
    'completed',
    'cancelled'
  ];

  private static readonly STATUS_TRANSITIONS: Record<AppointmentStatusType, AppointmentStatusType[]> = {
    scheduled: ['confirmed', 'cancelled'],
    confirmed: ['completed', 'cancelled'],
    completed: [],
    cancelled: ['scheduled']
  };

  constructor(status: AppointmentStatusType) {
    this.validateStatus(status);
    this._value = status;
  }

  get value(): AppointmentStatusType {
    return this._value;
  }

  private validateStatus(status: AppointmentStatusType): void {
    if (!AppointmentStatus.VALID_STATUSES.includes(status)) {
      throw new Error(
        `Invalid appointment status: ${status}. Valid statuses are: ${AppointmentStatus.VALID_STATUSES.join(', ')}`
      );
    }
  }

  get status(): AppointmentStatusType {
    return this._value;
  }

  /**
   * Check if this status can transition to another status
   */
  canTransitionTo(newStatus: AppointmentStatusType): boolean {
    const allowedTransitions = AppointmentStatus.STATUS_TRANSITIONS[this._value];
    return allowedTransitions.includes(newStatus);
  }

  /**
   * Get all valid transition statuses from current status
   */
  getValidTransitions(): AppointmentStatusType[] {
    return [...AppointmentStatus.STATUS_TRANSITIONS[this._value]];
  }

  /**
   * Business logic checks
   */
  isScheduled(): boolean {
    return this._value === 'scheduled';
  }

  isConfirmed(): boolean {
    return this._value === 'confirmed';
  }

  isCompleted(): boolean {
    return this._value === 'completed';
  }

  isCancelled(): boolean {
    return this._value === 'cancelled';
  }

  isActive(): boolean {
    return this._value === 'scheduled' || this._value === 'confirmed';
  }

  isFinal(): boolean {
    return this._value === 'completed' || this._value === 'cancelled';
  }

  equals(other: AppointmentStatus): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  /**
   * Factory methods for common statuses
   */
  static scheduled(): AppointmentStatus {
    return new AppointmentStatus('scheduled');
  }

  static confirmed(): AppointmentStatus {
    return new AppointmentStatus('confirmed');
  }

  static completed(): AppointmentStatus {
    return new AppointmentStatus('completed');
  }

  static cancelled(): AppointmentStatus {
    return new AppointmentStatus('cancelled');
  }

  /**
   * Get default status for new appointments
   */
  static default(): AppointmentStatus {
    return AppointmentStatus.scheduled();
  }
}