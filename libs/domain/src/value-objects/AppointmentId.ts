import { DomainException } from '../exceptions/DomainExceptions';

export class AppointmentId {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new DomainException('Appointment ID cannot be empty', 'INVALID_APPOINTMENT_ID');
    }

    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  equals(other: AppointmentId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}