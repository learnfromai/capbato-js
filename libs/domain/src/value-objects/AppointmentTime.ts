/**
 * Value Object for Appointment Time
 * Encapsulates appointment time validation and business logic
 */
export class AppointmentTime {
  private readonly _value: string;
  private static readonly TIME_REGEX = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  
  // Business hours configuration (can be made configurable later)
  private static readonly BUSINESS_START_HOUR = 8; // 8:00 AM
  private static readonly BUSINESS_END_HOUR = 17;   // 5:00 PM
  private static readonly APPOINTMENT_INTERVAL_MINUTES = 30; // 30-minute intervals

  constructor(time: string) {
    this.validateTime(time);
    this._value = time;
  }

  get value(): string {
    return this._value;
  }

  private validateTime(time: string): void {
    if (!AppointmentTime.TIME_REGEX.test(time)) {
      throw new Error('Invalid appointment time format. Use HH:MM format (24-hour)');
    }

    const [hours, minutes] = time.split(':').map(Number);
    
    // Validate business hours
    if (hours < AppointmentTime.BUSINESS_START_HOUR || hours >= AppointmentTime.BUSINESS_END_HOUR) {
      throw new Error(
        `Appointment time must be between ${AppointmentTime.BUSINESS_START_HOUR}:00 and ${AppointmentTime.BUSINESS_END_HOUR}:00`
      );
    }

    // Validate appointment intervals (e.g., only allow :00 and :30)
    if (minutes % AppointmentTime.APPOINTMENT_INTERVAL_MINUTES !== 0) {
      throw new Error(
        `Appointment time must be in ${AppointmentTime.APPOINTMENT_INTERVAL_MINUTES}-minute intervals (e.g., 09:00, 09:30)`
      );
    }
  }

  get time(): string {
    return this._value;
  }

  /**
   * Get hour component
   */
  getHour(): number {
    return parseInt(this._value.split(':')[0], 10);
  }

  /**
   * Get minute component
   */
  getMinute(): number {
    return parseInt(this._value.split(':')[1], 10);
  }

  /**
   * Convert to 12-hour format with AM/PM
   */
  to12HourFormat(): string {
    const hour = this.getHour();
    const minute = this.getMinute();
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  }

  /**
   * Convert to minutes since midnight for easy comparison
   */
  toMinutes(): number {
    return this.getHour() * 60 + this.getMinute();
  }

  /**
   * Check if this time is before another time
   */
  isBefore(other: AppointmentTime): boolean {
    return this.toMinutes() < other.toMinutes();
  }

  /**
   * Check if this time is after another time
   */
  isAfter(other: AppointmentTime): boolean {
    return this.toMinutes() > other.toMinutes();
  }

  equals(other: AppointmentTime): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  /**
   * Get the next available appointment slot
   */
  getNextSlot(): AppointmentTime {
    const currentMinutes = this.toMinutes();
    const nextMinutes = currentMinutes + AppointmentTime.APPOINTMENT_INTERVAL_MINUTES;
    
    // Check if next slot exceeds business hours
    const maxMinutes = AppointmentTime.BUSINESS_END_HOUR * 60;
    if (nextMinutes >= maxMinutes) {
      throw new Error('No more appointment slots available today');
    }
    
    const nextHour = Math.floor(nextMinutes / 60);
    const nextMinute = nextMinutes % 60;
    
    return new AppointmentTime(
      `${nextHour.toString().padStart(2, '0')}:${nextMinute.toString().padStart(2, '0')}`
    );
  }

  /**
   * Get all available time slots for a day
   */
  static getAvailableSlots(): AppointmentTime[] {
    const slots: AppointmentTime[] = [];
    const startMinutes = AppointmentTime.BUSINESS_START_HOUR * 60;
    const endMinutes = AppointmentTime.BUSINESS_END_HOUR * 60;
    
    for (let minutes = startMinutes; minutes < endMinutes; minutes += AppointmentTime.APPOINTMENT_INTERVAL_MINUTES) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(new AppointmentTime(timeString));
    }
    
    return slots;
  }

  /**
   * Factory method to create from 12-hour format
   */
  static from12Hour(time12: string): AppointmentTime {
    const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) {
      throw new Error('Invalid 12-hour time format. Use format like "9:30 AM"');
    }
    
    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    const period = match[3].toUpperCase();
    
    if (period === 'AM' && hour === 12) {
      hour = 0;
    } else if (period === 'PM' && hour !== 12) {
      hour += 12;
    }
    
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    return new AppointmentTime(timeString);
  }
}