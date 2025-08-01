import { injectable, inject } from 'tsyringe';
import { AppointmentNotFoundException } from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';
import type { CompleteAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for completing an appointment
 * Changes appointment status to completed
 */
@injectable()
export class CompleteAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(command: CompleteAppointmentCommand): Promise<void> {
    // Get existing appointment
    const appointment = await this.appointmentRepository.getById(command.id);
    if (!appointment) {
      throw new AppointmentNotFoundException(command.id);
    }

    // Complete appointment using domain logic
    const completedAppointment = appointment.complete();

    // Update in repository
    await this.appointmentRepository.update(command.id, completedAppointment);
  }
}