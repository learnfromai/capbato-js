import { DomainException } from '../exceptions/DomainExceptions';

export class ReasonForVisit {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new DomainException('Reason for visit cannot be empty', 'INVALID_REASON_FOR_VISIT');
    }

    if (value.trim().length < 3) {
      throw new DomainException('Reason for visit must be at least 3 characters long', 'INVALID_REASON_FOR_VISIT');
    }

    if (value.trim().length > 500) {
      throw new DomainException('Reason for visit cannot exceed 500 characters', 'INVALID_REASON_FOR_VISIT');
    }

    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  equals(other: ReasonForVisit): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}