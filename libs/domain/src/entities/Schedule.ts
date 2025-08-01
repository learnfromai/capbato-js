import { ScheduleId } from '../value-objects/ScheduleId';
import { DoctorName } from '../value-objects/DoctorName';
import { ScheduleDate } from '../value-objects/ScheduleDate';
import { ScheduleTime } from '../value-objects/ScheduleTime';
import { ScheduleConflictException } from '../exceptions/DomainExceptions';

interface ISchedule {
  id?: ScheduleId;
  doctorName: DoctorName;
  date: ScheduleDate;
  time: ScheduleTime;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Schedule Entity - Represents a doctor's scheduled appointment slot
 * 
 * This entity manages doctor scheduling information including time slots and availability.
 * It maintains business rules around scheduling conflicts and time management.
 * 
 * Business Rules:
 * - Each schedule must have a unique combination of doctor, date, and time
 * - Schedules cannot be created for past dates
 * - Times must be within business hours (8 AM - 6 PM)
 * - Times must be in 15-minute intervals
 */
export class Schedule implements ISchedule {
  private readonly _id?: ScheduleId;
  private readonly _doctorName: DoctorName;
  private readonly _date: ScheduleDate;
  private readonly _time: ScheduleTime;
  private readonly _createdAt: Date;
  private readonly _updatedAt?: Date;

  constructor(
    doctorName: string | DoctorName,
    date: Date | string | ScheduleDate,
    time: string | ScheduleTime,
    id?: string | ScheduleId,
    createdAt = new Date(),
    updatedAt?: Date
  ) {
    this._doctorName = doctorName instanceof DoctorName ? doctorName : new DoctorName(doctorName);
    this._date = date instanceof ScheduleDate ? date : new ScheduleDate(date);
    this._time = time instanceof ScheduleTime ? time : new ScheduleTime(time);
    this._id = id instanceof ScheduleId ? id : id ? new ScheduleId(id) : undefined;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;

    this.validate();
  }

  get id(): ScheduleId | undefined {
    return this._id;
  }

  get doctorName(): DoctorName {
    return this._doctorName;
  }

  get date(): ScheduleDate {
    return this._date;
  }

  get time(): ScheduleTime {
    return this._time;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  // Convenience getters for string values
  get stringId(): string | undefined {
    return this._id?.value;
  }

  get doctorNameValue(): string {
    return this._doctorName.value;
  }

  get dateValue(): Date {
    return this._date.value;
  }

  get timeValue(): string {
    return this._time.value;
  }

  get dateIsoString(): string {
    return this._date.isoString;
  }

  get timeFormatted24Hour(): string {
    return this._time.formatted24Hour;
  }

  get timeFormatted12Hour(): string {
    return this._time.formatted12Hour;
  }

  // Domain business logic methods
  updateDoctorName(newDoctorName: string | DoctorName): Schedule {
    const doctorName = newDoctorName instanceof DoctorName ? newDoctorName : new DoctorName(newDoctorName);
    return this.createCopy({ doctorName });
  }

  updateDate(newDate: Date | string | ScheduleDate): Schedule {
    const date = newDate instanceof ScheduleDate ? newDate : new ScheduleDate(newDate);
    return this.createCopy({ date });
  }

  updateTime(newTime: string | ScheduleTime): Schedule {
    const time = newTime instanceof ScheduleTime ? newTime : new ScheduleTime(newTime);
    return this.createCopy({ time });
  }

  reschedule(newDate: Date | string | ScheduleDate, newTime: string | ScheduleTime): Schedule {
    const date = newDate instanceof ScheduleDate ? newDate : new ScheduleDate(newDate);
    const time = newTime instanceof ScheduleTime ? newTime : new ScheduleTime(newTime);
    return this.createCopy({ date, time });
  }

  /**
   * Checks if this schedule is for today
   */
  isToday(): boolean {
    return this._date.isToday();
  }

  /**
   * Checks if this schedule is for tomorrow
   */
  isTomorrow(): boolean {
    return this._date.isTomorrow();
  }

  /**
   * Gets the number of days until this schedule
   */
  daysUntilSchedule(): number {
    const today = new ScheduleDate(new Date());
    return this._date.daysDifference(today);
  }

  /**
   * Checks if this schedule conflicts with another schedule
   * Schedules conflict if they have the same doctor, date, and time
   */
  conflictsWith(other: Schedule): boolean {
    return this._doctorName.equals(other._doctorName) &&
           this._date.equals(other._date) &&
           this._time.equals(other._time);
  }

  /**
   * Creates a copy of this schedule with modified properties
   * Immutable entity pattern - all changes create new instances
   */
  private createCopy(updates: {
    doctorName?: DoctorName;
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
   * Business equality comparison based on schedule details
   * Used to check for scheduling conflicts
   */
  hasSameScheduleDetails(other: Schedule): boolean {
    return this._doctorName.equals(other._doctorName) &&
           this._date.equals(other._date) &&
           this._time.equals(other._time);
  }

  /**
   * Validates business invariants
   */
  validate(): void {
    if (!this._doctorName || this._doctorName.value.trim().length === 0) {
      throw new Error('Schedule must have a valid doctor name');
    }

    if (!this._date) {
      throw new Error('Schedule must have a valid date');
    }

    if (!this._time) {
      throw new Error('Schedule must have a valid time');
    }

    if (this._createdAt && isNaN(this._createdAt.getTime())) {
      throw new Error('Schedule must have a valid creation date');
    }
  }

  /**
   * Gets a formatted display string for the schedule
   */
  getDisplayString(): string {
    return `Dr. ${this._doctorName.value} - ${this._date.isoString} at ${this._time.formatted12Hour}`;
  }

  /**
   * Gets a short display string for the schedule
   */
  getShortDisplayString(): string {
    return `${this._doctorName.value} - ${this._time.formatted12Hour}`;
  }
}

export type { ISchedule };