import { Appointment } from '../entities/Appointment';
import { AppointmentDate } from '../value-objects/AppointmentDate';
import { AppointmentTime } from '../value-objects/AppointmentTime';
import { AppointmentStatus } from '../value-objects/AppointmentStatus';
import {
  TimeSlotNotAvailableException,
  DuplicateAppointmentException,
  PastAppointmentException,
} from '../exceptions/DomainExceptions';

/**
 * Domain Service for complex appointment business logic
 * Handles cross-entity business rules and validation
 */
export class AppointmentDomainService {
  // Configuration constants
  private static readonly MAX_APPOINTMENTS_PER_SLOT = 4;
  private static readonly BUSINESS_DAYS_ADVANCE_BOOKING = 365; // 1 year

  /**
   * Validates appointment scheduling rules
   */
  static validateAppointmentScheduling(
    appointment: Appointment,
    existingAppointments: Appointment[]
  ): void {
    this.validateNotInPast(appointment);
    this.validateNoDuplicateForPatient(appointment, existingAppointments);
    this.validateTimeSlotAvailability(appointment, existingAppointments);
  }

  /**
   * Check if appointment is not in the past
   */
  private static validateNotInPast(appointment: Appointment): void {
    const appointmentDateTime = appointment.getAppointmentDateTime();
    const now = new Date();
    
    if (appointmentDateTime < now) {
      throw new PastAppointmentException();
    }
  }

  /**
   * Validate no duplicate appointment for same patient on same date
   */
  private static validateNoDuplicateForPatient(
    appointment: Appointment,
    existingAppointments: Appointment[]
  ): void {
    const duplicateExists = existingAppointments.some(existing => 
      existing.patientId === appointment.patientId &&
      existing.appointmentDate.isSameDay(appointment.appointmentDate) &&
      existing.status.isActive() &&
      (!appointment.id || !existing.id?.equals(appointment.id)) // Exclude self when updating
    );

    if (duplicateExists) {
      throw new DuplicateAppointmentException(
        appointment.patientId,
        appointment.appointmentDate.toISOString()
      );
    }
  }

  /**
   * Validate time slot availability
   */
  private static validateTimeSlotAvailability(
    appointment: Appointment,
    existingAppointments: Appointment[],
    maxAppointments: number = this.MAX_APPOINTMENTS_PER_SLOT
  ): void {
    const conflictingAppointments = existingAppointments.filter(existing =>
      existing.appointmentDate.isSameDay(appointment.appointmentDate) &&
      existing.appointmentTime.equals(appointment.appointmentTime) &&
      (existing.status.isConfirmed() || existing.status.isScheduled()) &&
      (!appointment.id || !existing.id?.equals(appointment.id)) // Exclude self when updating
    );

    if (conflictingAppointments.length >= maxAppointments) {
      throw new TimeSlotNotAvailableException(
        appointment.appointmentDate.toISOString(),
        appointment.appointmentTime.time
      );
    }
  }

  /**
   * Calculate available time slots for a given date
   */
  static getAvailableTimeSlots(
    date: AppointmentDate,
    existingAppointments: Appointment[],
    maxAppointments: number = this.MAX_APPOINTMENTS_PER_SLOT
  ): AppointmentTime[] {
    const allSlots = AppointmentTime.getAvailableSlots();
    
    return allSlots.filter(slot => {
      const appointmentsInSlot = existingAppointments.filter(appointment =>
        appointment.appointmentDate.isSameDay(date) &&
        appointment.appointmentTime.equals(slot) &&
        appointment.status.isActive()
      );
      
      return appointmentsInSlot.length < maxAppointments;
    });
  }

  /**
   * Check if a specific time slot is available
   */
  static isTimeSlotAvailable(
    date: AppointmentDate,
    time: AppointmentTime,
    existingAppointments: Appointment[],
    maxAppointments: number = this.MAX_APPOINTMENTS_PER_SLOT
  ): boolean {
    const appointmentsInSlot = existingAppointments.filter(appointment =>
      appointment.appointmentDate.isSameDay(date) &&
      appointment.appointmentTime.equals(time) &&
      appointment.status.isActive()
    );

    return appointmentsInSlot.length < maxAppointments;
  }

  /**
   * Get next available appointment slot for a patient
   */
  static getNextAvailableSlot(
    startDate: AppointmentDate,
    existingAppointments: Appointment[],
    daysToSearch: number = 30
  ): { date: AppointmentDate; time: AppointmentTime } | null {
    const searchDate = new Date(startDate.date);
    
    for (let i = 0; i < daysToSearch; i++) {
      const currentDate = new AppointmentDate(searchDate);
      
      // Skip weekends if needed (can be made configurable)
      if (!currentDate.isWeekend()) {
        const availableSlots = this.getAvailableTimeSlots(currentDate, existingAppointments);
        
        if (availableSlots.length > 0) {
          return {
            date: currentDate,
            time: availableSlots[0] // Return first available slot
          };
        }
      }
      
      searchDate.setDate(searchDate.getDate() + 1);
    }
    
    return null; // No available slots found
  }

  /**
   * Validate appointment can be confirmed
   */
  static canConfirmAppointment(appointment: Appointment): boolean {
    return appointment.status.canTransitionTo('confirmed') && 
           appointment.isFuture();
  }

  /**
   * Validate appointment can be completed
   */
  static canCompleteAppointment(appointment: Appointment): boolean {
    return appointment.status.canTransitionTo('completed');
  }

  /**
   * Validate appointment can be cancelled
   */
  static canCancelAppointment(appointment: Appointment): boolean {
    return appointment.status.canTransitionTo('cancelled');
  }

  /**
   * Check if appointment is overdue (past time and still active)
   */
  static isAppointmentOverdue(appointment: Appointment): boolean {
    return appointment.isOverdue();
  }

  /**
   * Calculate appointment statistics from a list
   */
  static calculateAppointmentStats(appointments: Appointment[]): {
    total: number;
    scheduled: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    overdue: number;
    today: number;
    thisWeek: number;
  } {
    const stats = {
      total: appointments.length,
      scheduled: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      overdue: 0,
      today: 0,
      thisWeek: 0,
    };

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week

    appointments.forEach(appointment => {
      // Status counts
      if (appointment.status.isScheduled()) stats.scheduled++;
      if (appointment.status.isConfirmed()) stats.confirmed++;
      if (appointment.status.isCompleted()) stats.completed++;
      if (appointment.status.isCancelled()) stats.cancelled++;
      
      // Special conditions
      if (appointment.isOverdue()) stats.overdue++;
      if (appointment.isToday()) stats.today++;
      
      // This week count
      const appointmentDate = appointment.appointmentDate.date;
      if (appointmentDate >= weekStart && appointmentDate <= today) {
        stats.thisWeek++;
      }
    });

    return stats;
  }

  /**
   * Sort appointments by date and time
   */
  static sortAppointmentsByDateTime(appointments: Appointment[]): Appointment[] {
    return [...appointments].sort((a, b) => {
      const dateComparison = a.appointmentDate.date.getTime() - b.appointmentDate.date.getTime();
      if (dateComparison !== 0) {
        return dateComparison;
      }
      
      // If same date, sort by time
      return a.appointmentTime.toMinutes() - b.appointmentTime.toMinutes();
    });
  }

  /**
   * Filter appointments by various criteria
   */
  static filterAppointments(
    appointments: Appointment[],
    criteria: {
      status?: string;
      patientId?: string;
      dateFrom?: Date;
      dateTo?: Date;
      isToday?: boolean;
      isFuture?: boolean;
      isOverdue?: boolean;
    }
  ): Appointment[] {
    return appointments.filter(appointment => {
      if (criteria.status && appointment.status.status !== criteria.status) {
        return false;
      }
      
      if (criteria.patientId && appointment.patientId !== criteria.patientId) {
        return false;
      }
      
      if (criteria.dateFrom && appointment.appointmentDate.date < criteria.dateFrom) {
        return false;
      }
      
      if (criteria.dateTo && appointment.appointmentDate.date > criteria.dateTo) {
        return false;
      }
      
      if (criteria.isToday !== undefined && appointment.isToday() !== criteria.isToday) {
        return false;
      }
      
      if (criteria.isFuture !== undefined && appointment.isFuture() !== criteria.isFuture) {
        return false;
      }
      
      if (criteria.isOverdue !== undefined && appointment.isOverdue() !== criteria.isOverdue) {
        return false;
      }
      
      return true;
    });
  }
}