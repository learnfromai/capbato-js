import { InvalidCityCodeException } from '../exceptions/DomainExceptions';

export class CityCode {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value.toLowerCase().trim();
  }

  get value(): string {
    return this._value;
  }

  private validate(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new InvalidCityCodeException('City code is required');
    }

    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new InvalidCityCodeException('City code cannot be empty');
    }

    if (trimmed.length > 100) {
      throw new InvalidCityCodeException('City code cannot exceed 100 characters');
    }
  }

  public equals(other: CityCode): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}