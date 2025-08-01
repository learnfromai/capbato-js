import { injectable, inject } from 'tsyringe';
import { Appointment, ReasonForVisit, PatientName, DoctorName, ContactNumber } from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';
import type { UpdateAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';
import { 
  AppointmentNotFoundException,
  DuplicateAppointmentException, 
  AppointmentTimeSlotUnavailableException 
} from '@nx-starter/domain';

/**
 * Use case for updating an existing appointment
 * Handles all business logic and validation for appointment updates
 */
@injectable()
export class UpdateAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(command: UpdateAppointmentCommand): Promise<Appointment> {
    // Get existing appointment
    const existingAppointment = await this.appointmentRepository.getById(command.id);
    if (!existingAppointment) {
      throw new AppointmentNotFoundException(command.id);
    }

    // Validate new values using value objects if provided
    const patientName = command.patientName ? new PatientName(command.patientName) : undefined;
    const reasonForVisit = command.reasonForVisit ? new ReasonForVisit(command.reasonForVisit) : undefined;
    const doctorName = command.doctorName ? new DoctorName(command.doctorName) : undefined;
    const contactNumber = command.contactNumber ? new ContactNumber(command.contactNumber) : undefined;
    const appointmentDate = command.appointmentDate ? new Date(command.appointmentDate) : undefined;

    // Business rule: Check for duplicate appointment if date is changing
    if (appointmentDate && appointmentDate.toDateString() !== existingAppointment.appointmentDate.toDateString()) {
      const hasConflictingAppointment = await this.appointmentRepository.hasConflictingAppointment(
        existingAppointment.patientId,
        appointmentDate,
        command.id // exclude current appointment
      );

      if (hasConflictingAppointment) {
        throw new DuplicateAppointmentException(existingAppointment.patientId, command.appointmentDate!);
      }
    }

    // Business rule: Check time slot availability if date or time is changing
    if ((appointmentDate || command.appointmentTime) && 
        (appointmentDate?.toDateString() !== existingAppointment.appointmentDate.toDateString() || 
         command.appointmentTime !== existingAppointment.appointmentTime)) {
      
      const checkDate = appointmentDate || existingAppointment.appointmentDate;
      const checkTime = command.appointmentTime || existingAppointment.appointmentTime;
      
      const timeSlotCount = await this.appointmentRepository.getTimeSlotCount(
        checkDate,
        checkTime,
        command.id // exclude current appointment
      );

      if (timeSlotCount >= 4) {
        throw new AppointmentTimeSlotUnavailableException(
          checkDate.toISOString().split('T')[0], 
          checkTime
        );
      }
    }

    // Update appointment using domain method
    const updatedAppointment = existingAppointment.update(
      patientName,
      reasonForVisit,
      appointmentDate,
      command.appointmentTime,
      doctorName,
      contactNumber
    );

    // Validate business invariants
    updatedAppointment.validate();

    // Persist changes
    await this.appointmentRepository.update(command.id, updatedAppointment);

    // Return updated appointment
    return updatedAppointment;
  }
}