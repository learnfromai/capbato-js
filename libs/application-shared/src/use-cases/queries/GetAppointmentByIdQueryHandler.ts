import { injectable, inject } from 'tsyringe';
import { Appointment } from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';
import type { GetAppointmentByIdQuery } from '../../dto/AppointmentQueries';
import { TOKENS } from '../../di/tokens';
import { AppointmentNotFoundException } from '@nx-starter/domain';

/**
 * Query handler for getting an appointment by ID
 * CQRS pattern - separate from command operations
 */
@injectable()
export class GetAppointmentByIdQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: GetAppointmentByIdQuery): Promise<Appointment> {
    const appointment = await this.appointmentRepository.getById(query.id);
    
    if (!appointment) {
      throw new AppointmentNotFoundException(query.id);
    }

    return appointment;
  }
}