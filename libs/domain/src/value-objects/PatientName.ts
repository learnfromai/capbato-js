import { DomainException } from '../exceptions/DomainExceptions';

export class PatientName {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new DomainException('Patient name cannot be empty', 'INVALID_PATIENT_NAME');
    }

    if (value.trim().length < 2) {
      throw new DomainException('Patient name must be at least 2 characters long', 'INVALID_PATIENT_NAME');
    }

    if (value.trim().length > 200) {
      throw new DomainException('Patient name cannot exceed 200 characters', 'INVALID_PATIENT_NAME');
    }

    // Basic validation for name format (letters, spaces, common punctuation)
    const namePattern = /^[a-zA-Z\s\-'.,]+$/;
    if (!namePattern.test(value.trim())) {
      throw new DomainException('Patient name contains invalid characters', 'INVALID_PATIENT_NAME');
    }

    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  equals(other: PatientName): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}