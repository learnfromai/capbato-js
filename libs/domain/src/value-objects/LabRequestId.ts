/**
 * Value Object for Lab Request ID
 * Ensures type safety and validation for lab request identifiers
 */
export class LabRequestId {
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
      throw new Error('Lab Request ID must be a non-empty string');
    }

    if (id.trim().length > 50) {
      throw new Error('Lab Request ID cannot exceed 50 characters');
    }
  }

  equals(other: LabRequestId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static fromString(value: string): LabRequestId {
    return new LabRequestId(value);
  }
}