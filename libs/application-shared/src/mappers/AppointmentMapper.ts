import { Appointment } from '@nx-starter/domain';
import type { AppointmentDto } from '../dto/AppointmentDto';

/**
 * Mapper for Appointment domain entity to/from DTOs
 * Handles data transformation between domain and presentation layers
 */
export class AppointmentMapper {
  /**
   * Convert Appointment domain entity to DTO
   */
  static toDto(appointment: Appointment): AppointmentDto {
    return {
      id: appointment.stringId || '',
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      reasonForVisit: appointment.reasonForVisit.reason,
      appointmentDate: appointment.appointmentDate.toISOString(),
      appointmentTime: appointment.appointmentTime.time,
      status: appointment.status.status,
      doctorName: appointment.doctorName,
      contactNumber: appointment.contactNumber?.value,
      notes: appointment.notes,
      createdAt: appointment.createdAt.toISOString(),
      updatedAt: appointment.updatedAt?.toISOString(),
    };
  }

  /**
   * Convert array of Appointment entities to DTO array
   */
  static toDtoArray(appointments: Appointment[]): AppointmentDto[] {
    return appointments.map(appointment => this.toDto(appointment));
  }

  /**
   * Convert plain object from database to Appointment domain entity
   */
  static fromPlainObject(plainObject: any): Appointment {
    return new Appointment(
      plainObject.patientId || plainObject.patient_id,
      plainObject.patientName || plainObject.patient_name,
      plainObject.reasonForVisit || plainObject.reason_for_visit,
      plainObject.appointmentDate || plainObject.appointment_date,
      plainObject.appointmentTime || plainObject.appointment_time,
      plainObject.status,
      plainObject.id,
      plainObject.doctorName || plainObject.doctor_name,
      plainObject.contactNumber || plainObject.contact_number,
      plainObject.notes,
      plainObject.createdAt || plainObject.created_at || new Date(),
      plainObject.updatedAt || plainObject.updated_at
    );
  }

  /**
   * Convert Appointment domain entity to plain object for database storage
   */
  static toPlainObject(appointment: Appointment): any {
    return {
      id: appointment.stringId,
      patient_id: appointment.patientId,
      patient_name: appointment.patientName,
      reason_for_visit: appointment.reasonForVisit.reason,
      appointment_date: appointment.appointmentDate.date,
      appointment_time: appointment.appointmentTime.time,
      status: appointment.status.status,
      doctor_name: appointment.doctorName,
      contact_number: appointment.contactNumber?.value,
      notes: appointment.notes,
      created_at: appointment.createdAt,
      updated_at: appointment.updatedAt,
    };
  }

  /**
   * Convert array of plain objects to Appointment entities
   */
  static fromPlainObjectArray(plainObjects: any[]): Appointment[] {
    return plainObjects.map(obj => this.fromPlainObject(obj));
  }

  /**
   * Convert array of Appointment entities to plain objects
   */
  static toPlainObjectArray(appointments: Appointment[]): any[] {
    return appointments.map(appointment => this.toPlainObject(appointment));
  }
}