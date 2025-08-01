import { injectable, inject } from 'tsyringe';
import { ScheduleNotFoundException } from '@nx-starter/domain';
import type { IScheduleRepository } from '@nx-starter/domain';
import type { DeleteScheduleCommand } from '../../dto/ScheduleCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for deleting a schedule
 * Handles all business logic and validation for schedule deletion
 */
@injectable()
export class DeleteScheduleUseCase {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(command: DeleteScheduleCommand): Promise<void> {
    // Check if schedule exists
    const existingSchedule = await this.scheduleRepository.getById(command.id);
    if (!existingSchedule) {
      throw new ScheduleNotFoundException(command.id);
    }

    // Delete using repository
    await this.scheduleRepository.delete(command.id);
  }
}