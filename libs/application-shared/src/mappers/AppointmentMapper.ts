import { Appointment } from '@nx-starter/domain';
import type { AppointmentDto, CreateAppointmentDto } from '../dto/AppointmentDto';
import type { AppointmentStatusType } from '@nx-starter/domain';

/**
 * Mapper for converting between Appointment entities and DTOs
 */
export class AppointmentMapper {
  /**
   * Maps an Appointment entity to an AppointmentDto
   */
  static toDto(appointment: Appointment): AppointmentDto {
    return {
      id: appointment.id?.value.toString() || '',
      patientId: appointment.patientId,
      patientName: appointment.patientName.value,
      reasonForVisit: appointment.reasonForVisit.value,
      appointmentDate: appointment.getFormattedDate(),
      appointmentTime: appointment.appointmentTime,
      status: appointment.status.value,
      contactNumber: appointment.contactNumber?.value,
      doctorName: appointment.doctorName?.value,
      createdAt: appointment.createdAt.toISOString(),
      updatedAt: appointment.updatedAt?.toISOString(),
    };
  }

  /**
   * Maps an array of Appointment entities to AppointmentDtos
   */
  static toDtoArray(appointments: Appointment[]): AppointmentDto[] {
    return appointments.map((appointment) => this.toDto(appointment));
  }

  /**
   * Maps an AppointmentDto to an Appointment entity
   */
  static toDomain(dto: AppointmentDto): Appointment {
    return new Appointment(
      dto.patientId,
      dto.patientName,
      dto.reasonForVisit,
      new Date(dto.appointmentDate),
      dto.appointmentTime,
      dto.status,
      new Date(dto.createdAt),
      dto.id || undefined,
      dto.contactNumber,
      dto.doctorName,
      dto.updatedAt ? new Date(dto.updatedAt) : undefined
    );
  }

  /**
   * Maps a CreateAppointmentDto to an Appointment entity
   */
  static createToDomain(dto: CreateAppointmentDto): Appointment {
    return new Appointment(
      dto.patientId,
      dto.patientName,
      dto.reasonForVisit,
      new Date(dto.appointmentDate),
      dto.appointmentTime,
      'scheduled',
      new Date(),
      undefined,
      dto.contactNumber,
      dto.doctorName
    );
  }

  /**
   * Maps a plain object from database to Appointment entity
   * This method is useful for ORM mapping
   */
  static fromPlainObject(obj: {
    id: string;
    patientId: string;
    patientName: string;
    reasonForVisit: string;
    appointmentDate: Date;
    appointmentTime: string;
    status: string;
    contactNumber?: string;
    doctorName?: string;
    createdAt: Date;
    updatedAt?: Date;
  }): Appointment {
    return new Appointment(
      obj.patientId,
      obj.patientName,
      obj.reasonForVisit,
      obj.appointmentDate,
      obj.appointmentTime,
      obj.status as AppointmentStatusType,
      obj.createdAt,
      obj.id,
      obj.contactNumber,
      obj.doctorName,
      obj.updatedAt
    );
  }

  /**
   * Maps Appointment entity to plain object for database storage
   */
  static toPlainObject(
    appointment: Appointment,
    id?: string
  ): {
    id?: string;
    patientId: string;
    patientName: string;
    reasonForVisit: string;
    appointmentDate: Date;
    appointmentTime: string;
    status: string;
    contactNumber?: string;
    doctorName?: string;
    createdAt: Date;
    updatedAt?: Date;
  } {
    return {
      ...(id && { id }),
      patientId: appointment.patientId,
      patientName: appointment.patientName.value,
      reasonForVisit: appointment.reasonForVisit.value,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      status: appointment.status.value,
      contactNumber: appointment.contactNumber?.value,
      doctorName: appointment.doctorName?.value,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    };
  }
}