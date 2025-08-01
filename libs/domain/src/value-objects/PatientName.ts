import { InvalidPatientNameException } from '../exceptions/DomainExceptions';

/**
 * Value Object for Patient Name
 * Encapsulates business rules for patient names
 */
export class PatientName {
  private readonly _value: string;

  constructor(value: string) {
    this.validatePatientName(value);
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

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

    // Basic validation for names - allow letters, spaces, hyphens, apostrophes
    const namePattern = /^[a-zA-Z\s\-'.]+$/;
    if (!namePattern.test(name.trim())) {
      throw new InvalidPatientNameException('can only contain letters, spaces, hyphens, and apostrophes');
    }
  }

  equals(other: PatientName): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}