import { AppointmentId } from '../value-objects/AppointmentId';
import { AppointmentDate } from '../value-objects/AppointmentDate';
import { AppointmentTime } from '../value-objects/AppointmentTime';
import { AppointmentStatus } from '../value-objects/AppointmentStatus';
import { ReasonForVisit } from '../value-objects/ReasonForVisit';
import { ContactNumber } from '../value-objects/ContactNumber';
import {
  AppointmentAlreadyConfirmedException,
  AppointmentAlreadyCompletedException,
  AppointmentAlreadyCancelledException,
  InvalidAppointmentTransitionException,
  PastAppointmentException,
} from '../exceptions/DomainExceptions';

interface IAppointment {
  id?: AppointmentId;
  patientId: string;
  patientName: string;
  reasonForVisit: ReasonForVisit;
  appointmentDate: AppointmentDate;
  appointmentTime: AppointmentTime;
  status: AppointmentStatus;
  doctorName?: string;
  contactNumber?: ContactNumber;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Appointment implements IAppointment {
  private readonly _id?: AppointmentId;
  private readonly _patientId: string;
  private readonly _patientName: string;
  private readonly _reasonForVisit: ReasonForVisit;
  private readonly _appointmentDate: AppointmentDate;
  private readonly _appointmentTime: AppointmentTime;
  private readonly _status: AppointmentStatus;
  private readonly _doctorName?: string;
  private readonly _contactNumber?: ContactNumber;
  private readonly _notes?: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt?: Date;

  constructor(
    patientId: string,
    patientName: string,
    reasonForVisit: string | ReasonForVisit,
    appointmentDate: Date | string | AppointmentDate,
    appointmentTime: string | AppointmentTime,
    status: string | AppointmentStatus = 'scheduled',
    id?: string | AppointmentId,
    doctorName?: string,
    contactNumber?: string | ContactNumber,
    notes?: string,
    createdAt = new Date(),
    updatedAt?: Date
  ) {
    this._patientId = this.validatePatientId(patientId);
    this._patientName = this.validatePatientName(patientName);
    this._reasonForVisit = reasonForVisit instanceof ReasonForVisit 
      ? reasonForVisit 
      : new ReasonForVisit(reasonForVisit);
    this._appointmentDate = appointmentDate instanceof AppointmentDate 
      ? appointmentDate 
      : new AppointmentDate(appointmentDate);
    this._appointmentTime = appointmentTime instanceof AppointmentTime 
      ? appointmentTime 
      : new AppointmentTime(appointmentTime);
    this._status = typeof status === 'string' 
      ? new AppointmentStatus(status as any) 
      : status;
    this._id = id instanceof AppointmentId ? id : id ? new AppointmentId(id) : undefined;
    this._doctorName = doctorName;
    this._contactNumber = contactNumber instanceof ContactNumber 
      ? contactNumber 
      : contactNumber ? new ContactNumber(contactNumber) : undefined;
    this._notes = notes;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;

    this.validateBusinessRules();
  }

  // Getters
  get id(): AppointmentId | undefined {
    return this._id;
  }

  get patientId(): string {
    return this._patientId;
  }

  get patientName(): string {
    return this._patientName;
  }

  get reasonForVisit(): ReasonForVisit {
    return this._reasonForVisit;
  }

  get appointmentDate(): AppointmentDate {
    return this._appointmentDate;
  }

  get appointmentTime(): AppointmentTime {
    return this._appointmentTime;
  }

  get status(): AppointmentStatus {
    return this._status;
  }

  get doctorName(): string | undefined {
    return this._doctorName;
  }

  get contactNumber(): ContactNumber | undefined {
    return this._contactNumber;
  }

  get notes(): string | undefined {
    return this._notes;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  // For backwards compatibility
  get stringId(): string | undefined {
    return this._id?.value;
  }

  // Validation methods
  private validatePatientId(patientId: string): string {
    if (!patientId || typeof patientId !== 'string' || !patientId.trim()) {
      throw new Error('Patient ID is required');
    }
    return patientId.trim();
  }

  private validatePatientName(name: string): string {
    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new Error('Patient name is required');
    }
    if (name.trim().length < 2) {
      throw new Error('Patient name must be at least 2 characters long');
    }
    return name.trim();
  }

  private validateBusinessRules(): void {
    // Check if appointment is in the past (combine date and time)
    const appointmentDateTime = new Date(this._appointmentDate.date);
    const [hours, minutes] = this._appointmentTime.time.split(':').map(Number);
    appointmentDateTime.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    if (appointmentDateTime < now && this._status.isActive()) {
      throw new PastAppointmentException();
    }
  }

  // Business logic methods (immutable updates)
  confirm(): Appointment {
    if (this._status.isConfirmed()) {
      throw new AppointmentAlreadyConfirmedException();
    }

    if (!this._status.canTransitionTo('confirmed')) {
      throw new InvalidAppointmentTransitionException(this._status.status, 'confirmed');
    }

    return this.createCopy({ 
      status: AppointmentStatus.confirmed(),
      updatedAt: new Date()
    });
  }

  complete(): Appointment {
    if (this._status.isCompleted()) {
      throw new AppointmentAlreadyCompletedException();
    }

    if (!this._status.canTransitionTo('completed')) {
      throw new InvalidAppointmentTransitionException(this._status.status, 'completed');
    }

    return this.createCopy({ 
      status: AppointmentStatus.completed(),
      updatedAt: new Date()
    });
  }

  cancel(): Appointment {
    if (this._status.isCancelled()) {
      throw new AppointmentAlreadyCancelledException();
    }

    if (!this._status.canTransitionTo('cancelled')) {
      throw new InvalidAppointmentTransitionException(this._status.status, 'cancelled');
    }

    return this.createCopy({ 
      status: AppointmentStatus.cancelled(),
      updatedAt: new Date()
    });
  }

  reschedule(newDate: Date | string | AppointmentDate, newTime: string | AppointmentTime): Appointment {
    const appointmentDate = newDate instanceof AppointmentDate 
      ? newDate 
      : new AppointmentDate(newDate);
    const appointmentTime = newTime instanceof AppointmentTime 
      ? newTime 
      : new AppointmentTime(newTime);

    return this.createCopy({
      appointmentDate,
      appointmentTime,
      status: AppointmentStatus.scheduled(), // Reset to scheduled when rescheduling
      updatedAt: new Date()
    });
  }

  updateNotes(notes: string): Appointment {
    return this.createCopy({ 
      notes: notes.trim(),
      updatedAt: new Date()
    });
  }

  updateDoctor(doctorName: string): Appointment {
    return this.createCopy({ 
      doctorName: doctorName.trim(),
      updatedAt: new Date()
    });
  }

  updateContactNumber(contactNumber: string | ContactNumber): Appointment {
    const newContactNumber = contactNumber instanceof ContactNumber 
      ? contactNumber 
      : new ContactNumber(contactNumber);

    return this.createCopy({ 
      contactNumber: newContactNumber,
      updatedAt: new Date()
    });
  }

  /**
   * Creates a copy of this appointment with modified properties
   * Immutable entity pattern - all changes create new instances
   */
  private createCopy(updates: {
    appointmentDate?: AppointmentDate;
    appointmentTime?: AppointmentTime;
    status?: AppointmentStatus;
    doctorName?: string;
    contactNumber?: ContactNumber;
    notes?: string;
    updatedAt?: Date;
  }): Appointment {
    return new Appointment(
      this._patientId,
      this._patientName,
      this._reasonForVisit,
      updates.appointmentDate || this._appointmentDate,
      updates.appointmentTime || this._appointmentTime,
      updates.status || this._status,
      this._id,
      updates.doctorName !== undefined ? updates.doctorName : this._doctorName,
      updates.contactNumber !== undefined ? updates.contactNumber : this._contactNumber,
      updates.notes !== undefined ? updates.notes : this._notes,
      this._createdAt,
      updates.updatedAt
    );
  }

  // Query methods
  isToday(): boolean {
    return this._appointmentDate.isToday();
  }

  isFuture(): boolean {
    const appointmentDateTime = new Date(this._appointmentDate.date);
    const [hours, minutes] = this._appointmentTime.time.split(':').map(Number);
    appointmentDateTime.setHours(hours, minutes, 0, 0);
    
    return appointmentDateTime > new Date();
  }

  isPast(): boolean {
    return !this.isFuture();
  }

  isOverdue(): boolean {
    return this.isPast() && this._status.isActive();
  }

  canBeModified(): boolean {
    return this._status.isActive() && this.isFuture();
  }

  getDurationSinceCreated(): number {
    return Date.now() - this._createdAt.getTime();
  }

  getAppointmentDateTime(): Date {
    const dateTime = new Date(this._appointmentDate.date);
    const [hours, minutes] = this._appointmentTime.time.split(':').map(Number);
    dateTime.setHours(hours, minutes, 0, 0);
    return dateTime;
  }

  /**
   * Domain equality comparison based on business identity
   */
  equals(other: Appointment): boolean {
    if (!this._id || !other._id) {
      return false;
    }
    return this._id.equals(other._id);
  }

  /**
   * Check if this appointment conflicts with another (same patient, same date)
   */
  conflictsWith(other: Appointment): boolean {
    return (
      this._patientId === other._patientId &&
      this._appointmentDate.isSameDay(other._appointmentDate) &&
      (this._status.isActive() || other._status.isActive())
    );
  }

  /**
   * Check if this appointment uses the same time slot as another
   */
  hasSameTimeSlot(other: Appointment): boolean {
    return (
      this._appointmentDate.isSameDay(other._appointmentDate) &&
      this._appointmentTime.equals(other._appointmentTime)
    );
  }

  /**
   * Validates business invariants
   */
  validate(): void {
    if (!this._patientId || !this._patientName || !this._reasonForVisit) {
      throw new Error('Appointment must have patient ID, name, and reason for visit');
    }

    if (!this._appointmentDate || !this._appointmentTime) {
      throw new Error('Appointment must have valid date and time');
    }

    // Re-validate business rules
    this.validateBusinessRules();
  }
}

export type { IAppointment };