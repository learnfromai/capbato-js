import { injectable, inject } from 'tsyringe';
import { Appointment } from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';
import type { ConfirmAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';
import { 
  AppointmentNotFoundException,
  AppointmentTimeSlotUnavailableException 
} from '@nx-starter/domain';

/**
 * Use case for confirming an appointment
 * Handles all business logic and validation for appointment confirmation
 */
@injectable()
export class ConfirmAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(command: ConfirmAppointmentCommand): Promise<Appointment> {
    // Get existing appointment
    const existingAppointment = await this.appointmentRepository.getById(command.id);
    if (!existingAppointment) {
      throw new AppointmentNotFoundException(command.id);
    }

    // Business rule: Check time slot availability before confirming
    const timeSlotCount = await this.appointmentRepository.getTimeSlotCount(
      existingAppointment.appointmentDate,
      existingAppointment.appointmentTime,
      command.id // exclude current appointment
    );

    if (timeSlotCount >= 4) {
      throw new AppointmentTimeSlotUnavailableException(
        existingAppointment.getFormattedDate(),
        existingAppointment.appointmentTime
      );
    }

    // Confirm appointment using domain method (includes business rules)
    const confirmedAppointment = existingAppointment.confirm();

    // Persist changes
    await this.appointmentRepository.update(command.id, confirmedAppointment);

    // Return confirmed appointment
    return confirmedAppointment;
  }
}