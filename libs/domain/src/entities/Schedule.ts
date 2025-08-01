import { ScheduleId } from '../value-objects/ScheduleId';
import { ScheduleDoctorName } from '../value-objects/ScheduleDoctorName';
import { ScheduleDate } from '../value-objects/ScheduleDate';
import { ScheduleTime } from '../value-objects/ScheduleTime';
import { InvalidScheduleException } from '../exceptions/DomainExceptions';

interface ISchedule {
  id?: ScheduleId;
  doctorName: ScheduleDoctorName;
  date: ScheduleDate;
  time: ScheduleTime;
  createdAt: Date;
}

export class Schedule implements ISchedule {
  private readonly _doctorName: ScheduleDoctorName;
  private readonly _date: ScheduleDate;
  private readonly _time: ScheduleTime;
  private readonly _id?: ScheduleId;
  private readonly _createdAt: Date;

  constructor(
    doctorName: string | ScheduleDoctorName,
    date: string | Date | ScheduleDate,
    time: string | ScheduleTime,
    createdAt = new Date(),
    id?: string | ScheduleId
  ) {
    this._doctorName = doctorName instanceof ScheduleDoctorName ? doctorName : new ScheduleDoctorName(doctorName);
    this._date = date instanceof ScheduleDate ? date : new ScheduleDate(date);
    this._time = time instanceof ScheduleTime ? time : new ScheduleTime(time);
    this._id = id instanceof ScheduleId ? id : id ? new ScheduleId(id) : undefined;
    this._createdAt = createdAt;

    this.validate();
  }

  get id(): ScheduleId | undefined {
    return this._id;
  }

  get doctorName(): ScheduleDoctorName {
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

  // For backwards compatibility with existing code that expects string ID
  get stringId(): string | undefined {
    return this._id?.value;
  }

  get doctorNameValue(): string {
    return this._doctorName.value;
  }

  get dateValue(): Date {
    return this._date.value;
  }

  get dateString(): string {
    return this._date.dateString;
  }

  get timeValue(): string {
    return this._time.value;
  }

  // Domain business logic methods
  updateDoctorName(newDoctorName: string | ScheduleDoctorName): Schedule {
    const doctorName = newDoctorName instanceof ScheduleDoctorName ? newDoctorName : new ScheduleDoctorName(newDoctorName);
    return this.createCopy({ doctorName });
  }

  updateDate(newDate: string | Date | ScheduleDate): Schedule {
    const date = newDate instanceof ScheduleDate ? newDate : new ScheduleDate(newDate);
    return this.createCopy({ date });
  }

  updateTime(newTime: string | ScheduleTime): Schedule {
    const time = newTime instanceof ScheduleTime ? newTime : new ScheduleTime(newTime);
    return this.createCopy({ time });
  }

  reschedule(newDate: string | Date | ScheduleDate, newTime: string | ScheduleTime): Schedule {
    const date = newDate instanceof ScheduleDate ? newDate : new ScheduleDate(newDate);
    const time = newTime instanceof ScheduleTime ? newTime : new ScheduleTime(newTime);
    return this.createCopy({ date, time });
  }

  /**
   * Creates a copy of this schedule with modified properties
   * Immutable entity pattern - all changes create new instances
   */
  private createCopy(updates: {
    doctorName?: ScheduleDoctorName;
    date?: ScheduleDate;
    time?: ScheduleTime;
  }): Schedule {
    return new Schedule(
      updates.doctorName || this._doctorName,
      updates.date || this._date,
      updates.time || this._time,
      this._createdAt,
      this._id
    );
  }

  isToday(): boolean {
    return this._date.isToday();
  }

  isFuture(): boolean {
    return this._date.isFuture();
  }

  isPast(): boolean {
    return this._date.isPast();
  }

  isInWorkingHours(): boolean {
    // Working hours are from 6 AM to 10 PM (already validated in ScheduleTime)
    return this._time.hour >= 6 && this._time.hour <= 22;
  }

  /**
   * Check if this schedule conflicts with another schedule
   * Two schedules conflict if they have the same doctor, date, and time
   */
  conflictsWith(other: Schedule): boolean {
    return this._doctorName.equals(other._doctorName) &&
           this._date.equals(other._date) &&
           this._time.equals(other._time);
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
   * Get a formatted display string for the schedule
   */
  getDisplayString(): string {
    return `${this._doctorName.value} - ${this._date.dateString} at ${this._time.to12HourFormat()}`;
  }

  /**
   * Validates business invariants
   */
  validate(): void {
    if (!this._doctorName || this._doctorName.value.trim().length === 0) {
      throw new InvalidScheduleException('Schedule must have a valid doctor name');
    }

    if (!this._date) {
      throw new InvalidScheduleException('Schedule must have a valid date');
    }

    if (!this._time) {
      throw new InvalidScheduleException('Schedule must have a valid time');
    }

    // Business rule: Cannot schedule in the past (except for today)
    if (this._date.isPast()) {
      throw new InvalidScheduleException('Cannot schedule appointments in the past');
    }

    // Business rule: Must be in working hours
    if (!this.isInWorkingHours()) {
      throw new InvalidScheduleException('Schedule must be within working hours (6:00 AM - 10:00 PM)');
    }
  }
}

export type { ISchedule };