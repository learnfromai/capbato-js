import { injectable, inject } from 'tsyringe';
import type { IAppointmentRepository } from '@nx-starter/domain';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for getting today's confirmed appointments count
 * CQRS pattern - separate from command operations
 */
@injectable()
export class GetTodayConfirmedAppointmentsQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(): Promise<{ total: number }> {
    const total = await this.appointmentRepository.getTodayConfirmedCount();
    return { total };
  }
}