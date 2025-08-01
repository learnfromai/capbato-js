import { injectable, inject } from 'tsyringe';
import { 
  Appointment, 
  AppointmentDomainService,
  ReasonForVisit,
  AppointmentDate,
  AppointmentTime,
  ContactNumber,
} from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';
import type { CreateAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';

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
    // Create value objects (domain validation)
    const reasonForVisit = new ReasonForVisit(command.reasonForVisit);
    const appointmentDate = new AppointmentDate(command.appointmentDate);
    const appointmentTime = new AppointmentTime(command.appointmentTime);
    const contactNumber = command.contactNumber ? new ContactNumber(command.contactNumber) : undefined;

    // Create appointment entity with domain logic
    const appointment = new Appointment(
      command.patientId,
      command.patientName,
      reasonForVisit,
      appointmentDate,
      appointmentTime,
      'scheduled', // new appointments start as scheduled
      undefined, // no ID yet
      command.doctorName,
      contactNumber,
      command.notes
    );

    // Validate business invariants
    appointment.validate();

    // Get existing appointments for business rule validation
    const existingAppointments = await this.appointmentRepository.getAll();

    // Apply domain service business rules
    AppointmentDomainService.validateAppointmentScheduling(appointment, existingAppointments);

    // Persist using repository
    const id = await this.appointmentRepository.create(appointment);

    // Return the created appointment with ID
    return new Appointment(
      appointment.patientId,
      appointment.patientName,
      appointment.reasonForVisit,
      appointment.appointmentDate,
      appointment.appointmentTime,
      appointment.status,
      id,
      appointment.doctorName,
      appointment.contactNumber,
      appointment.notes,
      appointment.createdAt
    );
  }
}