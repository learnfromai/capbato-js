import { InvalidPatientIdException } from '../exceptions/DomainExceptions';

/**
 * Value Object for Patient ID
 * Encapsulates business rules for patient identifiers
 */
export class PatientId {
  private readonly _value: string;

  constructor(value: string) {
    this.validatePatientId(value);
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  private validatePatientId(patientId: string): void {
    if (!patientId || !patientId.trim()) {
      throw new InvalidPatientIdException('cannot be empty');
    }

    if (patientId.trim().length > 50) {
      throw new InvalidPatientIdException('cannot exceed 50 characters');
    }

    if (patientId.trim().length < 1) {
      throw new InvalidPatientIdException('must be at least 1 character long');
    }
  }

  equals(other: PatientId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}