import { injectable, inject } from 'tsyringe';
import { Schedule, DoctorName, ScheduleDate, ScheduleTime } from '@nx-starter/domain';
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
    const doctorName = new DoctorName(command.doctorName);
    const date = new ScheduleDate(command.date);
    const time = new ScheduleTime(command.time);

    // Check for conflicting schedules
    const existingSchedule = await this.scheduleRepository.findConflictingSchedule(
      doctorName.value,
      date.value,
      time.value
    );

    if (existingSchedule) {
      throw new Error(`Schedule conflict: ${doctorName.value} is already scheduled on ${date.isoString} at ${time.formatted12Hour}`);
    }

    // Create schedule entity with domain logic
    const schedule = new Schedule(
      doctorName,
      date,
      time,
      undefined, // no ID yet
      new Date()
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
      id,
      schedule.createdAt
    );
  }
}