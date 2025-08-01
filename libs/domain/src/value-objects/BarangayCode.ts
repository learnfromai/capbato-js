import { InvalidBarangayCodeException } from '../exceptions/DomainExceptions';

export class BarangayCode {
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
      throw new InvalidBarangayCodeException('Barangay code is required');
    }

    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new InvalidBarangayCodeException('Barangay code cannot be empty');
    }

    if (trimmed.length > 100) {
      throw new InvalidBarangayCodeException('Barangay code cannot exceed 100 characters');
    }
  }

  public equals(other: BarangayCode): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}