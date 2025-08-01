import { InvalidScheduleDoctorNameException } from '../exceptions/DomainExceptions';

/**
 * Value Object for Schedule Doctor Name
 * Encapsulates business rules for doctor names in schedules
 */
export class ScheduleDoctorName {
  private readonly _value: string;

  constructor(value: string) {
    this.validateDoctorName(value);
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  private validateDoctorName(doctorName: string): void {
    if (!doctorName || !doctorName.trim()) {
      throw new InvalidScheduleDoctorNameException('cannot be empty');
    }

    if (doctorName.trim().length > 100) {
      throw new InvalidScheduleDoctorNameException('cannot exceed 100 characters');
    }

    if (doctorName.trim().length < 2) {
      throw new InvalidScheduleDoctorNameException('must be at least 2 characters long');
    }

    // Check for valid characters (letters, spaces, dots, hyphens)
    const validNameRegex = /^[a-zA-Z\s\.\-]+$/;
    if (!validNameRegex.test(doctorName.trim())) {
      throw new InvalidScheduleDoctorNameException('can only contain letters, spaces, dots, and hyphens');
    }
  }

  equals(other: ScheduleDoctorName): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}