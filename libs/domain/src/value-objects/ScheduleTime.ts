import { InvalidScheduleTimeException } from '../exceptions/DomainExceptions';

/**
 * Value Object for Schedule Time
 * Encapsulates business rules for schedule times
 */
export class ScheduleTime {
  private readonly _value: string;
  private readonly _hours: number;
  private readonly _minutes: number;

  constructor(value: string) {
    this.validateTime(value);
    this._value = value.trim();
    const [hours, minutes] = this.parseTime(value);
    this._hours = hours;
    this._minutes = minutes;
  }

  get value(): string {
    return this._value;
  }

  get hours(): number {
    return this._hours;
  }

  get minutes(): number {
    return this._minutes;
  }

  get formatted24Hour(): string {
    return `${this._hours.toString().padStart(2, '0')}:${this._minutes.toString().padStart(2, '0')}`;
  }

  get formatted12Hour(): string {
    const period = this._hours >= 12 ? 'PM' : 'AM';
    const hours12 = this._hours === 0 ? 12 : this._hours > 12 ? this._hours - 12 : this._hours;
    return `${hours12}:${this._minutes.toString().padStart(2, '0')} ${period}`;
  }

  private validateTime(time: string): void {
    if (!time || !time.trim()) {
      throw new InvalidScheduleTimeException('cannot be empty');
    }

    const timePattern = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timePattern.test(time.trim())) {
      throw new InvalidScheduleTimeException('must be in HH:MM format (24-hour)');
    }

    const [hours, minutes] = this.parseTime(time);

    // Business rule: Only allow times during business hours (8 AM to 6 PM)
    if (hours < 8 || hours >= 18) {
      throw new InvalidScheduleTimeException('must be during business hours (08:00 - 17:59)');
    }

    // Business rule: Only allow times in 15-minute intervals
    if (minutes % 15 !== 0) {
      throw new InvalidScheduleTimeException('must be in 15-minute intervals (00, 15, 30, 45)');
    }
  }

  private parseTime(time: string): [number, number] {
    const [hoursStr, minutesStr] = time.trim().split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    if (isNaN(hours) || isNaN(minutes)) {
      throw new InvalidScheduleTimeException('must contain valid hours and minutes');
    }

    return [hours, minutes];
  }

  equals(other: ScheduleTime): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  isBefore(other: ScheduleTime): boolean {
    if (this._hours !== other._hours) {
      return this._hours < other._hours;
    }
    return this._minutes < other._minutes;
  }

  isAfter(other: ScheduleTime): boolean {
    if (this._hours !== other._hours) {
      return this._hours > other._hours;
    }
    return this._minutes > other._minutes;
  }

  minutesDifference(other: ScheduleTime): number {
    const thisMinutes = this._hours * 60 + this._minutes;
    const otherMinutes = other._hours * 60 + other._minutes;
    return thisMinutes - otherMinutes;
  }
}