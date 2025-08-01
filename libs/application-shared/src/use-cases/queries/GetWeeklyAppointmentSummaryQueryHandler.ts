import { injectable, inject } from 'tsyringe';
import type { IAppointmentRepository } from '@nx-starter/domain';
import type { GetWeeklyAppointmentSummaryQuery } from '../../dto/AppointmentQueries';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for getting weekly appointment summary
 * CQRS pattern - separate from command operations
 */
@injectable()
export class GetWeeklyAppointmentSummaryQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: GetWeeklyAppointmentSummaryQuery): Promise<{ date: string; count: number }[]> {
    return await this.appointmentRepository.getWeeklySummary(query.startDate);
  }
}