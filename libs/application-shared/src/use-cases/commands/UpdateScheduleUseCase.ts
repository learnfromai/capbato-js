import { injectable, inject } from 'tsyringe';
import { Schedule, ScheduleNotFoundException } from '@nx-starter/domain';
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

  async execute(command: UpdateScheduleCommand): Promise<Schedule> {
    // Get existing schedule
    const existingSchedule = await this.scheduleRepository.getById(command.id);
    if (!existingSchedule) {
      throw new ScheduleNotFoundException(command.id);
    }

    // Create updated schedule using domain methods for rich domain logic
    let updatedSchedule = existingSchedule;

    if (command.doctorName !== undefined) {
      updatedSchedule = updatedSchedule.updateDoctorName(command.doctorName);
    }

    if (command.date !== undefined) {
      updatedSchedule = updatedSchedule.updateDate(command.date);
    }

    if (command.time !== undefined) {
      updatedSchedule = updatedSchedule.updateTime(command.time);
    }

    // If date or time changed, check for conflicts
    if (command.date !== undefined || command.time !== undefined) {
      const conflictingSchedule = await this.scheduleRepository.findConflictingSchedule(
        updatedSchedule.doctorNameValue,
        updatedSchedule.dateValue,
        updatedSchedule.timeValue
      );

      // Check if the conflicting schedule is a different schedule (not the one being updated)
      if (conflictingSchedule && conflictingSchedule.stringId !== command.id) {
        throw new Error(`Schedule conflict: ${updatedSchedule.doctorNameValue} is already scheduled on ${updatedSchedule.dateIsoString} at ${updatedSchedule.timeFormatted12Hour}`);
      }
    }

    // Validate business invariants after all updates
    updatedSchedule.validate();

    // Persist changes
    await this.scheduleRepository.update(command.id, updatedSchedule);

    return updatedSchedule;
  }
}