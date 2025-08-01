import { InvalidBloodChemValueException } from '../exceptions/DomainExceptions';

/**
 * Value Object for Blood Chemistry Test Value
 * Encapsulates business rules for blood chemistry test results
 */
export class BloodChemValue {
  private readonly _name: string;
  private readonly _value: number | string;

  constructor(name: string, value: number | string) {
    this.validateBloodChemValue(name, value);
    this._name = name.trim();
    this._value = value;
  }

  get name(): string {
    return this._name;
  }

  get value(): number | string {
    return this._value;
  }

  get numericValue(): number | null {
    if (typeof this._value === 'number') {
      return this._value;
    }
    const parsed = parseFloat(this._value);
    return isNaN(parsed) ? null : parsed;
  }

  get stringValue(): string {
    return this._value.toString();
  }

  private validateBloodChemValue(name: string, value: number | string): void {
    if (!name || !name.trim()) {
      throw new InvalidBloodChemValueException('test name cannot be empty');
    }

    if (value === null || value === undefined || value === '') {
      throw new InvalidBloodChemValueException('test value cannot be empty');
    }

    if (name.trim().length > 100) {
      throw new InvalidBloodChemValueException('test name cannot exceed 100 characters');
    }

    if (typeof value === 'string' && value.trim().length > 500) {
      throw new InvalidBloodChemValueException('test value cannot exceed 500 characters');
    }

    if (typeof value === 'number' && (value < 0 || value > 999999)) {
      throw new InvalidBloodChemValueException('numeric test value must be between 0 and 999999');
    }
  }

  /**
   * Check if this value is numeric
   */
  isNumeric(): boolean {
    return typeof this._value === 'number' || !isNaN(parseFloat(this._value.toString()));
  }

  /**
   * Get value within normal range (basic validation)
   * This is a simplified check - real implementation would have specific ranges per test
   */
  isWithinNormalRange(): boolean {
    const numericValue = this.numericValue;
    if (numericValue === null) {
      return true; // Non-numeric values are considered "normal" for this basic check
    }

    // Basic range checks for common blood chemistry values
    switch (this._name.toLowerCase()) {
      case 'fbs':
        return numericValue >= 70 && numericValue <= 100;
      case 'cholesterol':
        return numericValue < 200;
      case 'hdl':
        return numericValue >= 40;
      case 'ldl':
        return numericValue < 100;
      case 'triglycerides':
        return numericValue < 150;
      default:
        return true; // Unknown test, assume normal
    }
  }

  equals(other: BloodChemValue): boolean {
    return this._name === other._name && this._value === other._value;
  }

  toString(): string {
    return `${this._name}: ${this._value}`;
  }
}