import { injectable, inject } from 'tsyringe';
import { Appointment } from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';
import type { CancelAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';
import { AppointmentNotFoundException } from '@nx-starter/domain';

/**
 * Use case for cancelling an appointment
 * Handles all business logic and validation for appointment cancellation
 */
@injectable()
export class CancelAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(command: CancelAppointmentCommand): Promise<Appointment> {
    // Get existing appointment
    const existingAppointment = await this.appointmentRepository.getById(command.id);
    if (!existingAppointment) {
      throw new AppointmentNotFoundException(command.id);
    }

    // Cancel appointment using domain method (includes business rules)
    const cancelledAppointment = existingAppointment.cancel();

    // Persist changes
    await this.appointmentRepository.update(command.id, cancelledAppointment);

    // Return cancelled appointment
    return cancelledAppointment;
  }
}