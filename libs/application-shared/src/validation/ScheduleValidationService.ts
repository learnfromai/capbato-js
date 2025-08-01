import { injectable, inject } from 'tsyringe';
import { ValidationService, IValidationService } from './ValidationService';
import { TOKENS } from '../di/tokens';
import {
  CreateScheduleCommandSchema,
  UpdateScheduleCommandSchema,
  DeleteScheduleCommandSchema,
  GetScheduleByIdCommandSchema,
  CreateScheduleCommand,
  UpdateScheduleCommand,
  DeleteScheduleCommand,
  GetScheduleByIdCommand,
} from './ScheduleValidationSchemas';

/**
 * Validation service for CreateScheduleCommand
 * Encapsulates validation logic for creating new schedules
 */
@injectable()
export class CreateScheduleValidationService extends ValidationService<unknown, CreateScheduleCommand> {
  protected schema = CreateScheduleCommandSchema;
}

/**
 * Validation service for UpdateScheduleCommand
 * Encapsulates validation logic for updating existing schedules
 */
@injectable()
export class UpdateScheduleValidationService extends ValidationService<unknown, UpdateScheduleCommand> {
  protected schema = UpdateScheduleCommandSchema;
}

/**
 * Validation service for DeleteScheduleCommand
 * Encapsulates validation logic for deleting schedules
 */
@injectable()
export class DeleteScheduleValidationService extends ValidationService<unknown, DeleteScheduleCommand> {
  protected schema = DeleteScheduleCommandSchema;
}

/**
 * Validation service for GetScheduleByIdCommand
 * Encapsulates validation logic for getting schedule by ID
 */
@injectable()
export class GetScheduleByIdValidationService extends ValidationService<unknown, GetScheduleByIdCommand> {
  protected schema = GetScheduleByIdCommandSchema;
}

/**
 * Composite validation service that provides all Schedule validation operations
 * Follows the Facade pattern to provide a unified interface for Schedule validation
 */
@injectable()
export class ScheduleValidationService {
  constructor(
    @inject(TOKENS.CreateScheduleValidationService)
    private createValidator: CreateScheduleValidationService,
    @inject(TOKENS.UpdateScheduleValidationService)
    private updateValidator: UpdateScheduleValidationService,
    @inject(TOKENS.DeleteScheduleValidationService)
    private deleteValidator: DeleteScheduleValidationService,
    @inject(TOKENS.GetScheduleByIdValidationService)
    private getByIdValidator: GetScheduleByIdValidationService
  ) {}

  /**
   * Validates data for creating a new schedule
   */
  validateCreateCommand(data: unknown): CreateScheduleCommand {
    return this.createValidator.validate(data);
  }

  /**
   * Validates data for updating an existing schedule
   */
  validateUpdateCommand(data: unknown): UpdateScheduleCommand {
    return this.updateValidator.validate(data);
  }

  /**
   * Validates data for deleting a schedule
   */
  validateDeleteCommand(data: unknown): DeleteScheduleCommand {
    return this.deleteValidator.validate(data);
  }

  /**
   * Validates data for getting schedule by ID
   */
  validateGetByIdCommand(data: unknown): GetScheduleByIdCommand {
    return this.getByIdValidator.validate(data);
  }

  /**
   * Safe validation methods that don't throw exceptions
   */
  safeValidateCreateCommand(data: unknown) {
    return this.createValidator.safeParse(data);
  }

  safeValidateUpdateCommand(data: unknown) {
    return this.updateValidator.safeParse(data);
  }

  safeValidateDeleteCommand(data: unknown) {
    return this.deleteValidator.safeParse(data);
  }

  safeValidateGetByIdCommand(data: unknown) {
    return this.getByIdValidator.safeParse(data);
  }
}

// Export interfaces for dependency injection
export type ICreateScheduleValidationService = IValidationService<unknown, CreateScheduleCommand>;
export type IUpdateScheduleValidationService = IValidationService<unknown, UpdateScheduleCommand>;
export type IDeleteScheduleValidationService = IValidationService<unknown, DeleteScheduleCommand>;
export type IGetScheduleByIdValidationService = IValidationService<unknown, GetScheduleByIdCommand>;