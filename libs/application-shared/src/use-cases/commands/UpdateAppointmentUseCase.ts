import { injectable, inject } from 'tsyringe';
import { 
  Appointment,
  AppointmentNotFoundException,
  AppointmentDomainService,
  ReasonForVisit,
  AppointmentDate,
  AppointmentTime,
  ContactNumber,
} from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';
import type { UpdateAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for updating an existing appointment
 * Handles all business logic and validation for appointment updates
 */
@injectable()
export class UpdateAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(command: UpdateAppointmentCommand): Promise<void> {
    // Get existing appointment
    const existingAppointment = await this.appointmentRepository.getById(command.id);
    if (!existingAppointment) {
      throw new AppointmentNotFoundException(command.id);
    }

    // Create updated appointment with new values
    let updatedAppointment = existingAppointment;

    // Update patient info if provided
    if (command.patientId !== undefined) {
      // Create new appointment with updated patient ID
      updatedAppointment = new Appointment(
        command.patientId,
        command.patientName || updatedAppointment.patientName,
        updatedAppointment.reasonForVisit,
        updatedAppointment.appointmentDate,
        updatedAppointment.appointmentTime,
        updatedAppointment.status,
        updatedAppointment.id,
        updatedAppointment.doctorName,
        updatedAppointment.contactNumber,
        updatedAppointment.notes,
        updatedAppointment.createdAt,
        new Date() // set updated timestamp
      );
    }

    if (command.patientName !== undefined) {
      updatedAppointment = new Appointment(
        updatedAppointment.patientId,
        command.patientName,
        updatedAppointment.reasonForVisit,
        updatedAppointment.appointmentDate,
        updatedAppointment.appointmentTime,
        updatedAppointment.status,
        updatedAppointment.id,
        updatedAppointment.doctorName,
        updatedAppointment.contactNumber,
        updatedAppointment.notes,
        updatedAppointment.createdAt,
        new Date()
      );
    }

    // Update reason for visit if provided
    if (command.reasonForVisit !== undefined) {
      const reasonForVisit = new ReasonForVisit(command.reasonForVisit);
      updatedAppointment = new Appointment(
        updatedAppointment.patientId,
        updatedAppointment.patientName,
        reasonForVisit,
        updatedAppointment.appointmentDate,
        updatedAppointment.appointmentTime,
        updatedAppointment.status,
        updatedAppointment.id,
        updatedAppointment.doctorName,
        updatedAppointment.contactNumber,
        updatedAppointment.notes,
        updatedAppointment.createdAt,
        new Date()
      );
    }

    // Update date and time if provided (reschedule)
    if (command.appointmentDate !== undefined || command.appointmentTime !== undefined) {
      const newDate = command.appointmentDate 
        ? new AppointmentDate(command.appointmentDate)
        : updatedAppointment.appointmentDate;
      const newTime = command.appointmentTime 
        ? new AppointmentTime(command.appointmentTime)
        : updatedAppointment.appointmentTime;

      updatedAppointment = updatedAppointment.reschedule(newDate, newTime);
    }

    // Update doctor name if provided
    if (command.doctorName !== undefined) {
      updatedAppointment = updatedAppointment.updateDoctor(command.doctorName);
    }

    // Update contact number if provided
    if (command.contactNumber !== undefined) {
      const contactNumber = new ContactNumber(command.contactNumber);
      updatedAppointment = updatedAppointment.updateContactNumber(contactNumber);
    }

    // Update notes if provided
    if (command.notes !== undefined) {
      updatedAppointment = updatedAppointment.updateNotes(command.notes);
    }

    // Handle status changes separately with proper business logic
    if (command.status !== undefined && command.status !== updatedAppointment.status.status) {
      switch (command.status) {
        case 'confirmed':
          updatedAppointment = updatedAppointment.confirm();
          break;
        case 'completed':
          updatedAppointment = updatedAppointment.complete();
          break;
        case 'cancelled':
          updatedAppointment = updatedAppointment.cancel();
          break;
        case 'scheduled':
          // Allow transition back to scheduled (reschedule does this automatically)
          if (updatedAppointment.status.canTransitionTo('scheduled')) {
            updatedAppointment = new Appointment(
              updatedAppointment.patientId,
              updatedAppointment.patientName,
              updatedAppointment.reasonForVisit,
              updatedAppointment.appointmentDate,
              updatedAppointment.appointmentTime,
              'scheduled',
              updatedAppointment.id,
              updatedAppointment.doctorName,
              updatedAppointment.contactNumber,
              updatedAppointment.notes,
              updatedAppointment.createdAt,
              new Date()
            );
          }
          break;
      }
    }

    // Validate business rules if date/time changed
    if (command.appointmentDate !== undefined || command.appointmentTime !== undefined) {
      const existingAppointments = await this.appointmentRepository.getAll();
      AppointmentDomainService.validateAppointmentScheduling(updatedAppointment, existingAppointments);
    }

    // Validate business invariants
    updatedAppointment.validate();

    // Update in repository
    await this.appointmentRepository.update(command.id, updatedAppointment);
  }
}