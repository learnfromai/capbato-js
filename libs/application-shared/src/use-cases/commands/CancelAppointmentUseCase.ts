import { injectable, inject } from 'tsyringe';
import { AppointmentNotFoundException } from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';
import type { CancelAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for cancelling an appointment
 * Changes appointment status to cancelled
 */
@injectable()
export class CancelAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(command: CancelAppointmentCommand): Promise<void> {
    // Get existing appointment
    const appointment = await this.appointmentRepository.getById(command.id);
    if (!appointment) {
      throw new AppointmentNotFoundException(command.id);
    }

    // Cancel appointment using domain logic
    const cancelledAppointment = appointment.cancel();

    // Update in repository
    await this.appointmentRepository.update(command.id, cancelledAppointment);
  }
}