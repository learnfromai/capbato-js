import { Appointment } from '../entities/Appointment';
import { IAppointmentRepository } from '../repositories/IAppointmentRepository';
import { 
  TimeSlotUnavailableException,
  DuplicateAppointmentException,
  PatientNotExistsException
} from '../exceptions/DomainExceptions';

/**
 * Domain service for appointment business logic
 * Manual instantiation pattern - not dependency injected
 */
export class AppointmentDomainService {
  constructor(private appointmentRepository: IAppointmentRepository) {}

  /**
   * Validates business rules before creating an appointment
   */
  async validateAppointmentCreation(appointment: Appointment): Promise<void> {
    await this.validateTimeSlotAvailability(
      appointment.appointmentDate,
      appointment.timeValue
    );

    await this.validateNoDuplicateAppointment(
      appointment.patientId,
      appointment.appointmentDate
    );
  }

  /**
   * Validates business rules before updating an appointment
   */
  async validateAppointmentUpdate(
    appointment: Appointment,
    appointmentId: string
  ): Promise<void> {
    await this.validateTimeSlotAvailability(
      appointment.appointmentDate,
      appointment.timeValue,
      appointmentId
    );

    await this.validateNoDuplicateAppointment(
      appointment.patientId,
      appointment.appointmentDate,
      appointmentId
    );
  }

  /**
   * Validates that a time slot is available
   */
  async validateTimeSlotAvailability(
    date: Date,
    time: string,
    excludeId?: string
  ): Promise<void> {
    const isAvailable = await this.appointmentRepository.checkTimeSlotAvailability(
      date,
      time,
      excludeId
    );

    if (!isAvailable) {
      throw new TimeSlotUnavailableException(
        `Time slot at ${time} on ${date.toDateString()} is already booked`
      );
    }
  }

  /**
   * Validates that patient doesn't have duplicate appointment on same date
   */
  async validateNoDuplicateAppointment(
    patientId: string,
    date: Date,
    excludeId?: string
  ): Promise<void> {
    const hasDuplicate = await this.appointmentRepository.checkPatientDuplicateAppointment(
      patientId,
      date,
      excludeId
    );

    if (hasDuplicate) {
      throw new DuplicateAppointmentException(
        `Patient ${patientId} already has an appointment on ${date.toDateString()}`
      );
    }
  }

  /**
   * Calculates appointment statistics
   */
  async calculateAppointmentStats(): Promise<{
    total: number;
    confirmed: number;
    scheduled: number;
    cancelled: number;
    todayTotal: number;
    todayConfirmed: number;
  }> {
    const [
      allAppointments,
      todayAppointments,
      todayConfirmed
    ] = await Promise.all([
      this.appointmentRepository.getAll(),
      this.appointmentRepository.getTodayAppointments(),
      this.appointmentRepository.getTodayConfirmedAppointments()
    ]);

    const confirmed = allAppointments.filter(apt => apt.isConfirmed()).length;
    const scheduled = allAppointments.filter(apt => apt.isScheduled()).length;
    const cancelled = allAppointments.filter(apt => apt.isCancelled()).length;

    return {
      total: allAppointments.length,
      confirmed,
      scheduled,
      cancelled,
      todayTotal: todayAppointments.length,
      todayConfirmed: todayConfirmed.length
    };
  }

  /**
   * Gets appointments for a specific week
   */
  async getWeeklyAppointments(weekStartDate: Date): Promise<Appointment[]> {
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6);

    return this.appointmentRepository.getAppointmentsByDateRange(
      weekStartDate,
      weekEndDate
    );
  }

  /**
   * Checks if an appointment can be confirmed (time slot still available)
   */
  async canConfirmAppointment(appointment: Appointment): Promise<boolean> {
    if (appointment.isConfirmed()) {
      return false; // Already confirmed
    }

    if (appointment.isCancelled()) {
      return false; // Cannot confirm cancelled appointment
    }

    // Check if time slot is still available
    return this.appointmentRepository.checkTimeSlotAvailability(
      appointment.appointmentDate,
      appointment.timeValue,
      appointment.stringId
    );
  }
}
