import { InvalidScheduleDateException } from '../exceptions/DomainExceptions';

/**
 * Value Object for Schedule Date
 * Encapsulates business rules for schedule dates
 */
export class ScheduleDate {
  private readonly _value: Date;

  constructor(value: Date | string) {
    const date = value instanceof Date ? value : new Date(value);
    this.validateDate(date);
    this._value = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  get value(): Date {
    return new Date(this._value);
  }

  get isoString(): string {
    return this._value.toISOString().split('T')[0];
  }

  private validateDate(date: Date): void {
    if (isNaN(date.getTime())) {
      throw new InvalidScheduleDateException('must be a valid date');
    }

    // Ensure date is not in the past (but allow today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate < today) {
      throw new InvalidScheduleDateException('cannot be in the past');
    }

    // Validate reasonable date range (not more than 2 years in the future)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2);
    maxDate.setHours(0, 0, 0, 0);

    if (inputDate > maxDate) {
      throw new InvalidScheduleDateException('cannot be more than 2 years in the future');
    }
  }

  equals(other: ScheduleDate): boolean {
    return this._value.getTime() === other._value.getTime();
  }

  toString(): string {
    return this.isoString;
  }

  isToday(): boolean {
    const today = new Date();
    return this._value.getDate() === today.getDate() &&
           this._value.getMonth() === today.getMonth() &&
           this._value.getFullYear() === today.getFullYear();
  }

  isTomorrow(): boolean {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this._value.getDate() === tomorrow.getDate() &&
           this._value.getMonth() === tomorrow.getMonth() &&
           this._value.getFullYear() === tomorrow.getFullYear();
  }

  daysDifference(other: ScheduleDate): number {
    const diffTime = this._value.getTime() - other._value.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}