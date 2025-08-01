import { injectable, inject } from 'tsyringe';
import { AppointmentNotFoundException } from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';
import type { ConfirmAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for confirming an appointment
 * Changes appointment status from scheduled to confirmed
 */
@injectable()
export class ConfirmAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(command: ConfirmAppointmentCommand): Promise<void> {
    // Get existing appointment
    const appointment = await this.appointmentRepository.getById(command.id);
    if (!appointment) {
      throw new AppointmentNotFoundException(command.id);
    }

    // Confirm appointment using domain logic
    const confirmedAppointment = appointment.confirm();

    // Update in repository
    await this.appointmentRepository.update(command.id, confirmedAppointment);
  }
}