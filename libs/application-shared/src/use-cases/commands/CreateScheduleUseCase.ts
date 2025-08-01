import { injectable, inject } from 'tsyringe';
import { Schedule, ScheduleDoctorName, ScheduleDate, ScheduleTime } from '@nx-starter/domain';
import type { IScheduleRepository } from '@nx-starter/domain';
import type { CreateScheduleCommand } from '../../dto/ScheduleCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for creating a new schedule
 * Handles all business logic and validation for schedule creation
 */
@injectable()
export class CreateScheduleUseCase {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(command: CreateScheduleCommand): Promise<Schedule> {
    // Validate command using value objects (domain validation)
    const doctorName = new ScheduleDoctorName(command.doctorName);
    const date = new ScheduleDate(command.date);
    const time = new ScheduleTime(command.time);

    // Check for scheduling conflicts
    const hasConflict = await this.scheduleRepository.existsByDoctorNameAndDateTime(
      doctorName.value,
      date.dateString,
      time.value
    );

    if (hasConflict) {
      throw new Error(`Schedule conflict: Doctor ${doctorName.value} already has a schedule on ${date.dateString} at ${time.value}`);
    }

    // Create schedule entity with domain logic
    const schedule = new Schedule(
      doctorName,
      date,
      time,
      new Date(),
      undefined // no ID yet
    );

    // Validate business invariants
    schedule.validate();

    // Persist using repository
    const id = await this.scheduleRepository.create(schedule);

    // Return the created schedule with ID
    return new Schedule(
      doctorName,
      date,
      time,
      schedule.createdAt,
      id
    );
  }
}