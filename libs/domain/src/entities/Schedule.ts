import { ScheduleId } from '../value-objects/ScheduleId';
import { ScheduleDate } from '../value-objects/ScheduleDate';
import { ScheduleTime } from '../value-objects/ScheduleTime';

interface ISchedule {
  id?: ScheduleId;
  doctorName: string;
  date: ScheduleDate;
  time: ScheduleTime;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Schedule Entity - Doctor Schedule Management
 * 
 * This entity represents a doctor's scheduled appointment slot.
 * It maintains the relationship between doctors and their available time slots.
 * 
 * Responsibilities:
 * - Store doctor scheduling information (name, date, time)
 * - Validate business rules for scheduling (no past dates, reasonable hours, etc.)
 * - Provide methods for schedule manipulation and queries
 * - Ensure data consistency and business invariants
 */
export class Schedule implements ISchedule {
  private readonly _id?: ScheduleId;
  private readonly _doctorName: string;
  private readonly _date: ScheduleDate;
  private readonly _time: ScheduleTime;
  private readonly _createdAt: Date;
  private readonly _updatedAt?: Date;

  constructor(
    doctorName: string,
    date: string | Date | ScheduleDate,
    time: string | ScheduleTime,
    id?: string | ScheduleId,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    // Validate required fields
    if (!doctorName || doctorName.trim().length === 0) {
      throw new Error('Doctor name is required for Schedule entity');
    }

    if (doctorName.trim().length < 2) {
      throw new Error('Doctor name must be at least 2 characters long');
    }

    if (doctorName.trim().length > 100) {
      throw new Error('Doctor name cannot exceed 100 characters');
    }

    this._doctorName = doctorName.trim();
    this._date = date instanceof ScheduleDate ? date : new ScheduleDate(date);
    this._time = time instanceof ScheduleTime ? time : new ScheduleTime(time);
    this._id = id instanceof ScheduleId ? id : id ? new ScheduleId(id) : undefined;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt;

    // Validate business rules
    this.validate();
  }

  get id(): ScheduleId | undefined {
    return this._id;
  }

  get doctorName(): string {
    return this._doctorName;
  }

  get date(): ScheduleDate {
    return this._date;
  }

  get time(): ScheduleTime {
    return this._time;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt ? new Date(this._updatedAt) : undefined;
  }

  // For backwards compatibility with existing code that expects string ID
  get stringId(): string | undefined {
    return this._id?.value;
  }

  get dateString(): string {
    return this._date.isoString;
  }

  get timeString(): string {
    return this._time.value;
  }

  get formattedDate(): string {
    return this._date.formattedValue;
  }

  get formattedTime(): string {
    return this._time.formattedValue;
  }

  // Domain business logic methods

  /**
   * Update doctor name for this schedule
   */
  updateDoctorName(newDoctorName: string): Schedule {
    if (!newDoctorName || newDoctorName.trim().length === 0) {
      throw new Error('Doctor name cannot be empty');
    }

    return this.createCopy({ doctorName: newDoctorName.trim() });
  }

  /**
   * Reschedule to a new date
   */
  rescheduleDate(newDate: string | Date | ScheduleDate): Schedule {
    const scheduleDate = newDate instanceof ScheduleDate ? newDate : new ScheduleDate(newDate);
    return this.createCopy({ date: scheduleDate });
  }

  /**
   * Change the scheduled time
   */
  changeTime(newTime: string | ScheduleTime): Schedule {
    const scheduleTime = newTime instanceof ScheduleTime ? newTime : new ScheduleTime(newTime);
    return this.createCopy({ time: scheduleTime });
  }

  /**
   * Reschedule both date and time
   */
  reschedule(newDate: string | Date | ScheduleDate, newTime: string | ScheduleTime): Schedule {
    const scheduleDate = newDate instanceof ScheduleDate ? newDate : new ScheduleDate(newDate);
    const scheduleTime = newTime instanceof ScheduleTime ? newTime : new ScheduleTime(newTime);
    
    return this.createCopy({ 
      date: scheduleDate, 
      time: scheduleTime 
    });
  }

  /**
   * Check if this schedule is for today
   */
  isToday(): boolean {
    return this._date.isToday();
  }

  /**
   * Check if this schedule is in the future
   */
  isFuture(): boolean {
    if (this._date.isFuture()) {
      return true;
    }

    // If it's today, check if the time hasn't passed yet
    if (this._date.isToday()) {
      const now = new Date();
      const currentTime = new ScheduleTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
      return this._time.isAfter(currentTime);
    }

    return false;
  }

  /**
   * Check if this schedule conflicts with another schedule for the same doctor
   */
  conflictsWith(other: Schedule): boolean {
    // Different doctors can't conflict
    if (this._doctorName.toLowerCase() !== other._doctorName.toLowerCase()) {
      return false;
    }

    // Different dates can't conflict
    if (!this._date.equals(other._date)) {
      return false;
    }

    // Same time is a direct conflict
    if (this._time.equals(other._time)) {
      return true;
    }

    // Check if times are too close (e.g., within 30 minutes)
    const minGapMinutes = 30;
    return this._time.minutesBetween(other._time) < minGapMinutes;
  }

  /**
   * Get a summary string for this schedule
   */
  getSummary(): string {
    return `Dr. ${this._doctorName} scheduled for ${this.formattedDate} at ${this.formattedTime}`;
  }

  /**
   * Creates a copy of this schedule with modified properties
   * Immutable entity pattern - all changes create new instances
   */
  private createCopy(updates: {
    doctorName?: string;
    date?: ScheduleDate;
    time?: ScheduleTime;
  }): Schedule {
    return new Schedule(
      updates.doctorName || this._doctorName,
      updates.date || this._date,
      updates.time || this._time,
      this._id,
      this._createdAt,
      new Date() // Update the updatedAt timestamp
    );
  }

  /**
   * Domain equality comparison based on business identity
   */
  equals(other: Schedule): boolean {
    if (!this._id || !other._id) {
      return false;
    }
    return this._id.equals(other._id);
  }

  /**
   * Validates business invariants
   */
  validate(): void {
    if (!this._doctorName || this._doctorName.trim().length === 0) {
      throw new Error('Schedule must have a valid doctor name');
    }

    if (this._doctorName.trim().length < 2) {
      throw new Error('Doctor name must be at least 2 characters long');
    }

    if (!this._date) {
      throw new Error('Schedule must have a valid date');
    }

    if (!this._time) {
      throw new Error('Schedule must have a valid time');
    }

    // Additional business rule: ensure the schedule is not in the past
    if (!this.isFuture() && !this.isToday()) {
      throw new Error('Cannot create schedule for past dates/times');
    }
  }

  /**
   * Create a schedule for testing purposes that bypasses validation
   */
  static createUnsafe(
    doctorName: string,
    date: string | Date | ScheduleDate,
    time: string | ScheduleTime,
    id?: string | ScheduleId,
    createdAt?: Date,
    updatedAt?: Date
  ): Schedule {
    const schedule = Object.create(Schedule.prototype);
    schedule._doctorName = doctorName;
    schedule._date = date instanceof ScheduleDate ? date : ScheduleDate.createUnsafe(new Date(date));
    schedule._time = time instanceof ScheduleTime ? time : new ScheduleTime(time);
    schedule._id = id instanceof ScheduleId ? id : id ? new ScheduleId(id) : undefined;
    schedule._createdAt = createdAt || new Date();
    schedule._updatedAt = updatedAt;
    return schedule;
  }
}

export type { ISchedule };