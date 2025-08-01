import { InvalidBloodChemistryIdException } from '../exceptions/DomainExceptions';

/**
 * Value Object for Blood Chemistry ID
 * Encapsulates business rules for blood chemistry identifiers
 */
export class BloodChemistryId {
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
      throw new InvalidBloodChemistryIdException('cannot be empty');
    }

    if (id.trim().length > 255) {
      throw new InvalidBloodChemistryIdException('cannot exceed 255 characters');
    }
  }

  equals(other: BloodChemistryId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}