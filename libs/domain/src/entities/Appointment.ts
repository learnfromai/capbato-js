import { AppointmentId } from '../value-objects/AppointmentId';
import { AppointmentStatus, type AppointmentStatusType } from '../value-objects/AppointmentStatus';
import { ReasonForVisit } from '../value-objects/ReasonForVisit';
import { DoctorName } from '../value-objects/DoctorName';
import { PatientName } from '../value-objects/PatientName';
import { ContactNumber } from '../value-objects/ContactNumber';
import { 
  AppointmentAlreadyCancelledException, 
  InvalidAppointmentDateException,
  AppointmentAlreadyConfirmedException 
} from '../exceptions/DomainExceptions';

interface IAppointment {
  id?: AppointmentId;
  patientId: string;
  patientName: PatientName;
  reasonForVisit: ReasonForVisit;
  appointmentDate: Date;
  appointmentTime: string;
  status: AppointmentStatus;
  contactNumber?: ContactNumber;
  doctorName?: DoctorName;
  createdAt: Date;
  updatedAt?: Date;
}

export class Appointment implements IAppointment {
  private readonly _id?: AppointmentId;
  private readonly _patientId: string;
  private readonly _patientName: PatientName;
  private readonly _reasonForVisit: ReasonForVisit;
  private readonly _appointmentDate: Date;
  private readonly _appointmentTime: string;
  private readonly _status: AppointmentStatus;
  private readonly _contactNumber?: ContactNumber;
  private readonly _doctorName?: DoctorName;
  private readonly _createdAt: Date;
  private readonly _updatedAt?: Date;

  constructor(
    patientId: string,
    patientName: string | PatientName,
    reasonForVisit: string | ReasonForVisit,
    appointmentDate: Date,
    appointmentTime: string,
    status: AppointmentStatusType = 'scheduled',
    createdAt = new Date(),
    id?: string | AppointmentId,
    contactNumber?: string | ContactNumber,
    doctorName?: string | DoctorName,
    updatedAt?: Date
  ) {
    this._patientId = patientId;
    this._patientName = patientName instanceof PatientName ? patientName : new PatientName(patientName);
    this._reasonForVisit = reasonForVisit instanceof ReasonForVisit ? reasonForVisit : new ReasonForVisit(reasonForVisit);
    this._appointmentDate = appointmentDate;
    this._appointmentTime = appointmentTime;
    this._status = new AppointmentStatus(status);
    this._createdAt = createdAt;
    this._id = id instanceof AppointmentId ? id : id ? new AppointmentId(id) : undefined;
    this._contactNumber = contactNumber instanceof ContactNumber ? contactNumber : contactNumber ? new ContactNumber(contactNumber) : undefined;
    this._doctorName = doctorName instanceof DoctorName ? doctorName : doctorName ? new DoctorName(doctorName) : undefined;
    this._updatedAt = updatedAt;
  }

  get id(): AppointmentId | undefined {
    return this._id;
  }

  get patientId(): string {
    return this._patientId;
  }

  get patientName(): PatientName {
    return this._patientName;
  }

  get reasonForVisit(): ReasonForVisit {
    return this._reasonForVisit;
  }

  get appointmentDate(): Date {
    return this._appointmentDate;
  }

  get appointmentTime(): string {
    return this._appointmentTime;
  }

  get status(): AppointmentStatus {
    return this._status;
  }

  get contactNumber(): ContactNumber | undefined {
    return this._contactNumber;
  }

  get doctorName(): DoctorName | undefined {
    return this._doctorName;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  /**
   * Business logic: Cancel an appointment
   */
  cancel(): Appointment {
    if (this._status.value === 'cancelled') {
      throw new AppointmentAlreadyCancelledException(`Appointment ${this._id?.value} is already cancelled`);
    }

    return new Appointment(
      this._patientId,
      this._patientName,
      this._reasonForVisit,
      this._appointmentDate,
      this._appointmentTime,
      'cancelled',
      this._createdAt,
      this._id,
      this._contactNumber,
      this._doctorName,
      new Date()
    );
  }

  /**
   * Business logic: Confirm an appointment
   */
  confirm(): Appointment {
    if (this._status.value === 'confirmed') {
      throw new AppointmentAlreadyConfirmedException(`Appointment ${this._id?.value} is already confirmed`);
    }

    if (this._status.value === 'cancelled') {
      throw new AppointmentAlreadyCancelledException(`Cannot confirm a cancelled appointment ${this._id?.value}`);
    }

    return new Appointment(
      this._patientId,
      this._patientName,
      this._reasonForVisit,
      this._appointmentDate,
      this._appointmentTime,
      'confirmed',
      this._createdAt,
      this._id,
      this._contactNumber,
      this._doctorName,
      new Date()
    );
  }

  /**
   * Business logic: Update appointment details
   */
  update(
    patientName?: string | PatientName,
    reasonForVisit?: string | ReasonForVisit,
    appointmentDate?: Date,
    appointmentTime?: string,
    doctorName?: string | DoctorName,
    contactNumber?: string | ContactNumber
  ): Appointment {
    if (this._status.value === 'cancelled') {
      throw new AppointmentAlreadyCancelledException(`Cannot update a cancelled appointment ${this._id?.value}`);
    }

    return new Appointment(
      this._patientId,
      patientName ?? this._patientName,
      reasonForVisit ?? this._reasonForVisit,
      appointmentDate ?? this._appointmentDate,
      appointmentTime ?? this._appointmentTime,
      this._status.value,
      this._createdAt,
      this._id,
      contactNumber ?? this._contactNumber,
      doctorName ?? this._doctorName,
      new Date()
    );
  }

  /**
   * Business validation
   */
  validate(): void {
    const now = new Date();
    const appointmentDateTime = new Date(`${this._appointmentDate.toISOString().split('T')[0]}T${this._appointmentTime}`);
    
    if (appointmentDateTime <= now && this._status.value !== 'cancelled') {
      throw new InvalidAppointmentDateException('Cannot schedule an appointment in the past');
    }
  }

  /**
   * Check if appointment is on a specific date
   */
  isOnDate(date: Date): boolean {
    return this._appointmentDate.toDateString() === date.toDateString();
  }

  /**
   * Check if appointment is confirmed
   */
  isConfirmed(): boolean {
    return this._status.value === 'confirmed';
  }

  /**
   * Check if appointment is today
   */
  isToday(): boolean {
    return this.isOnDate(new Date());
  }

  /**
   * Get appointment date as string
   */
  getFormattedDate(): string {
    return this._appointmentDate.toISOString().split('T')[0];
  }
}