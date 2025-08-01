import { injectable, inject } from 'tsyringe';
import { Appointment } from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for getting all appointments
 * CQRS pattern - separate from command operations
 */
@injectable()
export class GetAllAppointmentsQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(): Promise<Appointment[]> {
    return await this.appointmentRepository.getAll();
  }
}