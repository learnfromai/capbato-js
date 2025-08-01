import { injectable, inject } from 'tsyringe';
import { Schedule, ScheduleDoctorName, ScheduleDate, ScheduleTime, ScheduleNotFoundException } from '@nx-starter/domain';
import type { IScheduleRepository } from '@nx-starter/domain';
import type { UpdateScheduleCommand } from '../../dto/ScheduleCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for updating an existing schedule
 * Handles all business logic and validation for schedule updates
 */
@injectable()
export class UpdateScheduleUseCase {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(command: UpdateScheduleCommand): Promise<void> {
    // Validate command using value objects (domain validation)
    const doctorName = new ScheduleDoctorName(command.doctorName);
    const date = new ScheduleDate(command.date);
    const time = new ScheduleTime(command.time);

    // Check if schedule exists
    const existingSchedule = await this.scheduleRepository.getById(command.id);
    if (!existingSchedule) {
      throw new ScheduleNotFoundException(command.id);
    }

    // Check for scheduling conflicts (exclude current schedule)
    const hasConflict = await this.scheduleRepository.existsByDoctorNameAndDateTime(
      doctorName.value,
      date.dateString,
      time.value
    );

    if (hasConflict) {
      // Check if the conflict is with the same schedule being updated
      const conflictingSchedule = await this.scheduleRepository.getByDate(date.dateString);
      const isSameSchedule = conflictingSchedule.some(s => 
        s.stringId === command.id && 
        s.doctorNameValue === doctorName.value && 
        s.timeValue === time.value
      );

      if (!isSameSchedule) {
        throw new Error(`Schedule conflict: Doctor ${doctorName.value} already has a schedule on ${date.dateString} at ${time.value}`);
      }
    }

    // Create updated schedule entity with domain logic
    const updatedSchedule = new Schedule(
      doctorName,
      date,
      time,
      existingSchedule.createdAt,
      command.id
    );

    // Validate business invariants
    updatedSchedule.validate();

    // Update using repository
    await this.scheduleRepository.update(command.id, {
      doctorName: updatedSchedule.doctorName,
      date: updatedSchedule.date,
      time: updatedSchedule.time,
    });
  }
}