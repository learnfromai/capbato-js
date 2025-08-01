/**
 * Value Object for Patient ID
 * Ensures type safety and validation for patient identifiers
 */
export class PatientId {
  private readonly _value: string;

  constructor(value: string) {
    this.validateId(value);
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  private validateId(id: string): void {
    if (typeof id !== 'string' || id.trim().length === 0) {
      throw new Error('Patient ID must be a non-empty string');
    }

    if (id.trim().length > 50) {
      throw new Error('Patient ID cannot exceed 50 characters');
    }
  }

  equals(other: PatientId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static fromString(value: string): PatientId {
    return new PatientId(value);
  }
}