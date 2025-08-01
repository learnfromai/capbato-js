import { injectable, inject } from 'tsyringe';
import { Appointment, ReasonForVisit, PatientName, DoctorName, ContactNumber } from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';
import type { CreateAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';
import { 
  DuplicateAppointmentException, 
  AppointmentTimeSlotUnavailableException 
} from '@nx-starter/domain';

/**
 * Use case for creating a new appointment
 * Handles all business logic and validation for appointment creation
 */
@injectable()
export class CreateAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(command: CreateAppointmentCommand): Promise<Appointment> {
    // Validate command using value objects (domain validation)
    const patientName = new PatientName(command.patientName);
    const reasonForVisit = new ReasonForVisit(command.reasonForVisit);
    const doctorName = command.doctorName ? new DoctorName(command.doctorName) : undefined;
    const contactNumber = command.contactNumber ? new ContactNumber(command.contactNumber) : undefined;

    const appointmentDate = new Date(command.appointmentDate);

    // Business rule: Check for duplicate appointment (same patient, same date)
    const hasConflictingAppointment = await this.appointmentRepository.hasConflictingAppointment(
      command.patientId,
      appointmentDate
    );

    if (hasConflictingAppointment) {
      throw new DuplicateAppointmentException(command.patientId, command.appointmentDate);
    }

    // Business rule: Check time slot availability (max 4 appointments per slot)
    const timeSlotCount = await this.appointmentRepository.getTimeSlotCount(
      appointmentDate,
      command.appointmentTime
    );

    if (timeSlotCount >= 4) {
      throw new AppointmentTimeSlotUnavailableException(command.appointmentDate, command.appointmentTime);
    }

    // Create appointment entity with domain logic
    const appointment = new Appointment(
      command.patientId,
      patientName,
      reasonForVisit,
      appointmentDate,
      command.appointmentTime,
      'scheduled', // new appointments start as scheduled
      new Date(), // createdAt
      undefined, // no ID yet
      contactNumber,
      doctorName
    );

    // Validate business invariants
    appointment.validate();

    // Persist using repository
    const id = await this.appointmentRepository.create(appointment);

    // Return the created appointment with ID
    return new Appointment(
      command.patientId,
      patientName,
      reasonForVisit,
      appointmentDate,
      command.appointmentTime,
      'scheduled',
      appointment.createdAt,
      id,
      contactNumber,
      doctorName
    );
  }
}