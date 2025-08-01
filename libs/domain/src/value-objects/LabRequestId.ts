import { InvalidLabRequestIdException } from '../exceptions/DomainExceptions';

/**
 * Value Object for Lab Request ID
 * Encapsulates business rules for lab request identifiers
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
    if (!id || !id.trim()) {
      throw new InvalidLabRequestIdException('cannot be empty');
    }

    if (id.trim().length > 255) {
      throw new InvalidLabRequestIdException('cannot exceed 255 characters');
    }
  }

  equals(other: LabRequestId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}