import { injectable, inject } from 'tsyringe';
import { ScheduleNotFoundException } from '@nx-starter/domain';
import type { IScheduleRepository } from '@nx-starter/domain';
import type { DeleteScheduleCommand } from '../../dto/ScheduleCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for deleting an existing schedule
 * Handles business logic and validation for schedule deletion
 */
@injectable()
export class DeleteScheduleUseCase {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(command: DeleteScheduleCommand): Promise<void> {
    // Business logic: Check if schedule exists before deletion
    const existingSchedule = await this.scheduleRepository.getById(command.id);
    if (!existingSchedule) {
      throw new ScheduleNotFoundException(command.id);
    }

    // Additional business logic could be added here:
    // - Check if schedule is in the past (maybe allow/disallow deletion)
    // - Check permissions (only certain users can delete schedules)
    // - Log deletion event
    // - Send notifications to affected parties
    // - Archive instead of delete (soft delete)
    // - Check if there are dependent appointments

    await this.scheduleRepository.delete(command.id);
  }
}