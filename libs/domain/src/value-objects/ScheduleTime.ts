import { InvalidScheduleTimeException } from '../exceptions/DomainExceptions';

/**
 * Value Object for Schedule Time
 * Encapsulates business rules for schedule times
 */
export class ScheduleTime {
  private readonly _value: string;
  private readonly _hour: number;
  private readonly _minute: number;

  constructor(value: string) {
    this.validateTime(value);
    this._value = value.trim();
    const [hour, minute] = this.parseTime(value);
    this._hour = hour;
    this._minute = minute;
  }

  get value(): string {
    return this._value;
  }

  get hour(): number {
    return this._hour;
  }

  get minute(): number {
    return this._minute;
  }

  private validateTime(time: string): void {
    if (!time || !time.trim()) {
      throw new InvalidScheduleTimeException('cannot be empty');
    }

    // Support formats: HH:MM, H:MM, HH:M, H:M (24-hour format)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    
    if (!timeRegex.test(time.trim())) {
      throw new InvalidScheduleTimeException('must be in HH:MM format (24-hour)');
    }

    const [hourStr, minuteStr] = time.trim().split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    if (hour < 0 || hour > 23) {
      throw new InvalidScheduleTimeException('hour must be between 0 and 23');
    }

    if (minute < 0 || minute > 59) {
      throw new InvalidScheduleTimeException('minute must be between 0 and 59');
    }

    // Business rule: Schedule times should be in working hours (6:00 AM to 10:00 PM)
    if (hour < 6 || hour > 22) {
      throw new InvalidScheduleTimeException('schedule time must be between 6:00 AM and 10:00 PM');
    }

    // Business rule: Schedule times should be in 15-minute intervals
    if (minute % 15 !== 0) {
      throw new InvalidScheduleTimeException('schedule time must be in 15-minute intervals (00, 15, 30, 45)');
    }
  }

  private parseTime(time: string): [number, number] {
    const [hourStr, minuteStr] = time.trim().split(':');
    return [parseInt(hourStr, 10), parseInt(minuteStr, 10)];
  }

  equals(other: ScheduleTime): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  /**
   * Format time in 12-hour format with AM/PM
   */
  to12HourFormat(): string {
    const hour12 = this._hour === 0 ? 12 : this._hour > 12 ? this._hour - 12 : this._hour;
    const ampm = this._hour >= 12 ? 'PM' : 'AM';
    const minuteStr = this._minute.toString().padStart(2, '0');
    return `${hour12}:${minuteStr} ${ampm}`;
  }

  /**
   * Format time in 24-hour format with leading zeros
   */
  to24HourFormat(): string {
    const hourStr = this._hour.toString().padStart(2, '0');
    const minuteStr = this._minute.toString().padStart(2, '0');
    return `${hourStr}:${minuteStr}`;
  }

  /**
   * Check if this time is before another time
   */
  isBefore(other: ScheduleTime): boolean {
    return this._hour < other._hour || (this._hour === other._hour && this._minute < other._minute);
  }

  /**
   * Check if this time is after another time
   */
  isAfter(other: ScheduleTime): boolean {
    return this._hour > other._hour || (this._hour === other._hour && this._minute > other._minute);
  }

  static fromString(timeString: string): ScheduleTime {
    return new ScheduleTime(timeString);
  }
}