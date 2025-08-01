import { injectable, inject } from 'tsyringe';
import { ValidationService, IValidationService } from './ValidationService';
import { TOKENS } from '../di/tokens';
import {
  CreateScheduleCommandSchema,
  UpdateScheduleCommandSchema,
  DeleteScheduleCommandSchema,
  GetScheduleByIdQuerySchema,
  GetSchedulesByDateQuerySchema,
  GetSchedulesByDoctorQuerySchema,
  CreateScheduleCommand,
  UpdateScheduleCommand,
  DeleteScheduleCommand,
  GetScheduleByIdQuery,
  GetSchedulesByDateQuery,
  GetSchedulesByDoctorQuery,
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
 * Validation service for GetScheduleByIdQuery
 * Encapsulates validation logic for getting schedule by ID
 */
@injectable()
export class GetScheduleByIdValidationService extends ValidationService<unknown, GetScheduleByIdQuery> {
  protected schema = GetScheduleByIdQuerySchema;
}

/**
 * Validation service for GetSchedulesByDateQuery
 * Encapsulates validation logic for getting schedules by date
 */
@injectable()
export class GetSchedulesByDateValidationService extends ValidationService<unknown, GetSchedulesByDateQuery> {
  protected schema = GetSchedulesByDateQuerySchema;
}

/**
 * Validation service for GetSchedulesByDoctorQuery
 * Encapsulates validation logic for getting schedules by doctor
 */
@injectable()
export class GetSchedulesByDoctorValidationService extends ValidationService<unknown, GetSchedulesByDoctorQuery> {
  protected schema = GetSchedulesByDoctorQuerySchema;
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
    private getByIdValidator: GetScheduleByIdValidationService,
    @inject(TOKENS.GetSchedulesByDateValidationService)
    private getByDateValidator: GetSchedulesByDateValidationService,
    @inject(TOKENS.GetSchedulesByDoctorValidationService)
    private getByDoctorValidator: GetSchedulesByDoctorValidationService
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
   * Validates data for getting a schedule by ID
   */
  validateGetByIdQuery(data: unknown): GetScheduleByIdQuery {
    return this.getByIdValidator.validate(data);
  }

  /**
   * Validates data for getting schedules by date
   */
  validateGetByDateQuery(data: unknown): GetSchedulesByDateQuery {
    return this.getByDateValidator.validate(data);
  }

  /**
   * Validates data for getting schedules by doctor
   */
  validateGetByDoctorQuery(data: unknown): GetSchedulesByDoctorQuery {
    return this.getByDoctorValidator.validate(data);
  }

  /**
   * Safe validation for create command (non-throwing)
   */
  safeValidateCreateCommand(data: unknown) {
    return this.createValidator.safeValidate(data);
  }

  /**
   * Safe validation for update command (non-throwing)
   */
  safeValidateUpdateCommand(data: unknown) {
    return this.updateValidator.safeValidate(data);
  }

  /**
   * Safe validation for delete command (non-throwing)
   */
  safeValidateDeleteCommand(data: unknown) {
    return this.deleteValidator.safeValidate(data);
  }
}