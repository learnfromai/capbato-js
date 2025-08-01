import { injectable, inject } from 'tsyringe';
import { ValidationService } from './ValidationService';
import { TOKENS } from '../di/tokens';
import {
  CreateScheduleCommandSchema,
  UpdateScheduleCommandSchema,
  DeleteScheduleCommandSchema,
  RescheduleCommandSchema,
  CreateScheduleRequestSchema,
  UpdateScheduleRequestSchema,
  RescheduleRequestSchema,
  CreateScheduleCommandType,
  UpdateScheduleCommandType,
  DeleteScheduleCommandType,
  RescheduleCommandType,
  CreateScheduleRequestType,
  UpdateScheduleRequestType,
  RescheduleRequestType,
} from './ScheduleValidationSchemas';

/**
 * Validation service for CreateScheduleCommand
 * Encapsulates validation logic for creating new schedules
 */
@injectable()
export class CreateScheduleValidationService extends ValidationService<unknown, CreateScheduleCommandType> {
  protected schema = CreateScheduleCommandSchema;
}

/**
 * Validation service for UpdateScheduleCommand
 * Encapsulates validation logic for updating existing schedules
 */
@injectable()
export class UpdateScheduleValidationService extends ValidationService<unknown, UpdateScheduleCommandType> {
  protected schema = UpdateScheduleCommandSchema;
}

/**
 * Validation service for DeleteScheduleCommand
 * Encapsulates validation logic for deleting schedules
 */
@injectable()
export class DeleteScheduleValidationService extends ValidationService<unknown, DeleteScheduleCommandType> {
  protected schema = DeleteScheduleCommandSchema;
}

/**
 * Validation service for RescheduleCommand
 * Encapsulates validation logic for rescheduling appointments
 */
@injectable()
export class RescheduleValidationService extends ValidationService<unknown, RescheduleCommandType> {
  protected schema = RescheduleCommandSchema;
}

/**
 * Validation service for CreateScheduleRequest (API layer)
 * Encapsulates validation logic for API create requests
 */
@injectable()
export class CreateScheduleRequestValidationService extends ValidationService<unknown, CreateScheduleRequestType> {
  protected schema = CreateScheduleRequestSchema;
}

/**
 * Validation service for UpdateScheduleRequest (API layer)
 * Encapsulates validation logic for API update requests
 */
@injectable()
export class UpdateScheduleRequestValidationService extends ValidationService<unknown, UpdateScheduleRequestType> {
  protected schema = UpdateScheduleRequestSchema;
}

/**
 * Validation service for RescheduleRequest (API layer)
 * Encapsulates validation logic for API reschedule requests
 */
@injectable()
export class RescheduleRequestValidationService extends ValidationService<unknown, RescheduleRequestType> {
  protected schema = RescheduleRequestSchema;
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
    @inject(TOKENS.RescheduleValidationService)
    private rescheduleValidator: RescheduleValidationService,
    @inject(TOKENS.CreateScheduleRequestValidationService)
    private createRequestValidator: CreateScheduleRequestValidationService,
    @inject(TOKENS.UpdateScheduleRequestValidationService)
    private updateRequestValidator: UpdateScheduleRequestValidationService,
    @inject(TOKENS.RescheduleRequestValidationService)
    private rescheduleRequestValidator: RescheduleRequestValidationService
  ) {}

  /**
   * Validates data for creating a new schedule
   */
  validateCreateCommand(data: unknown): CreateScheduleCommandType {
    return this.createValidator.validate(data);
  }

  /**
   * Validates data for updating an existing schedule
   */
  validateUpdateCommand(data: unknown): UpdateScheduleCommandType {
    return this.updateValidator.validate(data);
  }

  /**
   * Validates data for deleting a schedule
   */
  validateDeleteCommand(data: unknown): DeleteScheduleCommandType {
    return this.deleteValidator.validate(data);
  }

  /**
   * Validates data for rescheduling
   */
  validateRescheduleCommand(data: unknown): RescheduleCommandType {
    return this.rescheduleValidator.validate(data);
  }

  /**
   * Validates API request data for creating a new schedule
   */
  validateCreateRequest(data: unknown): CreateScheduleRequestType {
    return this.createRequestValidator.validate(data);
  }

  /**
   * Validates API request data for updating an existing schedule
   */
  validateUpdateRequest(data: unknown): UpdateScheduleRequestType {
    return this.updateRequestValidator.validate(data);
  }

  /**
   * Validates API request data for rescheduling
   */
  validateRescheduleRequest(data: unknown): RescheduleRequestType {
    return this.rescheduleRequestValidator.validate(data);
  }

  /**
   * Safe validation that doesn't throw exceptions
   * Returns validation result with success/error details
   */
  safeValidateCreateCommand(data: unknown): { success: boolean; data?: CreateScheduleCommandType; error?: string } {
    const result = this.createValidator.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error.message };
  }

  /**
   * Safe validation for update commands
   */
  safeValidateUpdateCommand(data: unknown): { success: boolean; data?: UpdateScheduleCommandType; error?: string } {
    const result = this.updateValidator.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error.message };
  }

  /**
   * Safe validation for delete commands
   */
  safeValidateDeleteCommand(data: unknown): { success: boolean; data?: DeleteScheduleCommandType; error?: string } {
    const result = this.deleteValidator.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error.message };
  }

  /**
   * Safe validation for reschedule commands
   */
  safeValidateRescheduleCommand(data: unknown): { success: boolean; data?: RescheduleCommandType; error?: string } {
    const result = this.rescheduleValidator.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error.message };
  }
}