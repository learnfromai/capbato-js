/**
 * Value Object for Appointment Date
 * Encapsulates appointment date validation and business logic
 */
export class AppointmentDate {
  private readonly _value: Date;

  constructor(date: Date | string) {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    this.validateDate(parsedDate);
    this._value = parsedDate;
  }

  get value(): Date {
    return this._value;
  }

  private validateDate(date: Date): void {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid appointment date: must be a valid date');
    }

    // Remove time component for date-only comparison
    const appointmentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (appointmentDate < todayDate) {
      throw new Error('Cannot book appointment for a past date');
    }

    // Optional: Limit how far in advance appointments can be booked (e.g., 1 year)
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    
    if (appointmentDate > oneYearFromNow) {
      throw new Error('Cannot book appointment more than one year in advance');
    }
  }

  get date(): Date {
    return this._value;
  }

  /**
   * Get date in YYYY-MM-DD format
   */
  toISOString(): string {
    return this._value.toISOString().split('T')[0];
  }

  /**
   * Check if appointment is for today
   */
  isToday(): boolean {
    const today = new Date();
    const appointmentDate = this._value;
    
    return appointmentDate.getFullYear() === today.getFullYear() &&
           appointmentDate.getMonth() === today.getMonth() &&
           appointmentDate.getDate() === today.getDate();
  }

  /**
   * Check if appointment is in the future
   */
  isFuture(): boolean {
    const today = new Date();
    const appointmentDate = new Date(this._value.getFullYear(), this._value.getMonth(), this._value.getDate());
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    return appointmentDate > todayDate;
  }

  /**
   * Check if appointment is within a specific number of days from now
   */
  isWithinDays(days: number): boolean {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    
    return this._value <= targetDate;
  }

  /**
   * Get day of the week
   */
  getDayOfWeek(): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[this._value.getDay()];
  }

  /**
   * Check if date is a weekend
   */
  isWeekend(): boolean {
    const day = this._value.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  }

  equals(other: AppointmentDate): boolean {
    return this._value.getTime() === other._value.getTime();
  }

  toString(): string {
    return this._value.toISOString().split('T')[0];
  }

  /**
   * Factory method for today's date
   */
  static today(): AppointmentDate {
    return new AppointmentDate(new Date());
  }

  /**
   * Factory method for a date from string
   */
  static fromString(dateString: string): AppointmentDate {
    return new AppointmentDate(dateString);
  }

  /**
   * Compare with another appointment date
   */
  isSameDay(other: AppointmentDate): boolean {
    const thisDate = this._value;
    const otherDate = other._value;
    
    return thisDate.getFullYear() === otherDate.getFullYear() &&
           thisDate.getMonth() === otherDate.getMonth() &&
           thisDate.getDate() === otherDate.getDate();
  }
}