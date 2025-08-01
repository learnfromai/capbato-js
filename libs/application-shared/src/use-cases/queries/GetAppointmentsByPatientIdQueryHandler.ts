import { injectable, inject } from 'tsyringe';
import { Appointment } from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';
import type { GetAppointmentsByPatientIdQuery } from '../../dto/AppointmentQueries';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for getting appointments by patient ID
 * CQRS pattern - separate from command operations
 */
@injectable()
export class GetAppointmentsByPatientIdQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: GetAppointmentsByPatientIdQuery): Promise<Appointment[]> {
    return await this.appointmentRepository.getByPatientId(query.patientId);
  }
}