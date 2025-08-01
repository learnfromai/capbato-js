import { injectable, inject } from 'tsyringe';
import { 
  AppointmentNotFoundException,
  AppointmentDomainService,
  AppointmentDate,
  AppointmentTime,
} from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';
import type { RescheduleAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for rescheduling an appointment
 * Changes appointment date and time, resets status to scheduled
 */
@injectable()
export class RescheduleAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(command: RescheduleAppointmentCommand): Promise<void> {
    // Get existing appointment
    const appointment = await this.appointmentRepository.getById(command.id);
    if (!appointment) {
      throw new AppointmentNotFoundException(command.id);
    }

    // Create new date and time value objects
    const newDate = new AppointmentDate(command.appointmentDate);
    const newTime = new AppointmentTime(command.appointmentTime);

    // Reschedule appointment using domain logic
    const rescheduledAppointment = appointment.reschedule(newDate, newTime);

    // Validate business rules for new time slot
    const existingAppointments = await this.appointmentRepository.getAll();
    AppointmentDomainService.validateAppointmentScheduling(rescheduledAppointment, existingAppointments);

    // Update in repository
    await this.appointmentRepository.update(command.id, rescheduledAppointment);
  }
}