import { injectable, inject } from 'tsyringe';
import type { IAppointmentRepository } from '@nx-starter/domain';
import type { DeleteAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';
import { AppointmentNotFoundException } from '@nx-starter/domain';

/**
 * Use case for deleting an appointment
 * Handles all business logic and validation for appointment deletion
 */
@injectable()
export class DeleteAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(command: DeleteAppointmentCommand): Promise<void> {
    // Verify appointment exists
    const existingAppointment = await this.appointmentRepository.getById(command.id);
    if (!existingAppointment) {
      throw new AppointmentNotFoundException(command.id);
    }

    // Delete appointment
    await this.appointmentRepository.delete(command.id);
  }
}