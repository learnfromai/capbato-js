import { InvalidScheduleDateException } from '../exceptions/DomainExceptions';

/**
 * Value Object for Schedule Date
 * Encapsulates business rules for schedule dates
 */
export class ScheduleDate {
  private readonly _value: Date;

  constructor(value: string | Date) {
    const date = typeof value === 'string' ? new Date(value) : value;
    this.validateDate(date);
    this._value = new Date(date.getFullYear(), date.getMonth(), date.getDate()); // Normalize to start of day
  }

  get value(): Date {
    return new Date(this._value);
  }

  get dateString(): string {
    return this._value.toISOString().split('T')[0];
  }

  private validateDate(date: Date): void {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new InvalidScheduleDateException('must be a valid date');
    }

    // Don't allow dates too far in the past (more than 1 year ago)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    if (date < oneYearAgo) {
      throw new InvalidScheduleDateException('cannot be more than 1 year in the past');
    }

    // Don't allow dates too far in the future (more than 2 years ahead)
    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
    
    if (date > twoYearsFromNow) {
      throw new InvalidScheduleDateException('cannot be more than 2 years in the future');
    }
  }

  equals(other: ScheduleDate): boolean {
    return this._value.getTime() === other._value.getTime();
  }

  toString(): string {
    return this.dateString;
  }

  isToday(): boolean {
    const today = new Date();
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return this._value.getTime() === todayNormalized.getTime();
  }

  isFuture(): boolean {
    const today = new Date();
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return this._value.getTime() > todayNormalized.getTime();
  }

  isPast(): boolean {
    const today = new Date();
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return this._value.getTime() < todayNormalized.getTime();
  }

  static today(): ScheduleDate {
    return new ScheduleDate(new Date());
  }

  static fromString(dateString: string): ScheduleDate {
    return new ScheduleDate(dateString);
  }
}