import { InvalidBarangayNameException } from '../exceptions/DomainExceptions';

export class BarangayName {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  private validate(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new InvalidBarangayNameException('Barangay name is required');
    }

    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new InvalidBarangayNameException('Barangay name cannot be empty');
    }

    if (trimmed.length > 255) {
      throw new InvalidBarangayNameException('Barangay name cannot exceed 255 characters');
    }
  }

  public equals(other: BarangayName): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}