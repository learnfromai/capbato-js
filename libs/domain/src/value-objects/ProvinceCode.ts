import { InvalidProvinceCodeException } from '../exceptions/DomainExceptions';

export class ProvinceCode {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value.toUpperCase().trim();
  }

  get value(): string {
    return this._value;
  }

  private validate(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new InvalidProvinceCodeException('Province code is required');
    }

    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new InvalidProvinceCodeException('Province code cannot be empty');
    }

    if (trimmed.length > 100) {
      throw new InvalidProvinceCodeException('Province code cannot exceed 100 characters');
    }
  }

  public equals(other: ProvinceCode): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}