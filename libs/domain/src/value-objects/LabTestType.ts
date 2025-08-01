import { InvalidLabTestTypeException } from '../exceptions/DomainExceptions';

/**
 * Value Object for Lab Test Type
 * Encapsulates business rules for laboratory test types and values
 */
export class LabTestType {
  private readonly _name: string;
  private readonly _value: string;

  constructor(name: string, value: string) {
    this.validateLabTest(name, value);
    this._name = name.trim();
    this._value = value.trim();
  }

  get name(): string {
    return this._name;
  }

  get value(): string {
    return this._value;
  }

  private validateLabTest(name: string, value: string): void {
    if (!name || !name.trim()) {
      throw new InvalidLabTestTypeException('test name cannot be empty');
    }

    if (!value || !value.trim()) {
      throw new InvalidLabTestTypeException('test value cannot be empty');
    }

    if (name.trim().length > 100) {
      throw new InvalidLabTestTypeException('test name cannot exceed 100 characters');
    }

    if (value.trim().length > 500) {
      throw new InvalidLabTestTypeException('test value cannot exceed 500 characters');
    }

    // Validate that the value is not just "no" or empty values
    if (value.trim().toLowerCase() === 'no') {
      throw new InvalidLabTestTypeException('test value cannot be "no" - test should not be included if not selected');
    }
  }

  /**
   * Check if this is a selected test (has a meaningful value)
   */
  isSelected(): boolean {
    return this._value.trim().toLowerCase() !== 'no' && this._value.trim() !== '';
  }

  equals(other: LabTestType): boolean {
    return this._name === other._name && this._value === other._value;
  }

  toString(): string {
    return `${this._name}: ${this._value}`;
  }
}