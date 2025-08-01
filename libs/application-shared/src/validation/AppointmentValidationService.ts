import { injectable, inject } from 'tsyringe';
import { ValidationService, IValidationService } from './ValidationService';
import { TOKENS } from '../di/tokens';
import {
  CreateAppointmentCommandSchema,
  UpdateAppointmentCommandSchema,
  ConfirmAppointmentCommandSchema,
  CancelAppointmentCommandSchema,
  CompleteAppointmentCommandSchema,
  RescheduleAppointmentCommandSchema,
  CreateAppointmentCommand,
  UpdateAppointmentCommand,
  ConfirmAppointmentCommand,
  CancelAppointmentCommand,
  CompleteAppointmentCommand,
  RescheduleAppointmentCommand,
} from './AppointmentValidationSchemas';

/**
 * Validation service for CreateAppointmentCommand
 * Encapsulates validation logic for creating new appointments
 */
@injectable()
export class CreateAppointmentValidationService extends ValidationService<unknown, CreateAppointmentCommand> {
  protected schema = CreateAppointmentCommandSchema;
}

/**
 * Validation service for UpdateAppointmentCommand
 * Encapsulates validation logic for updating existing appointments
 */
@injectable()
export class UpdateAppointmentValidationService extends ValidationService<unknown, UpdateAppointmentCommand> {
  protected schema = UpdateAppointmentCommandSchema;
}

/**
 * Validation service for ConfirmAppointmentCommand
 * Encapsulates validation logic for confirming appointments
 */
@injectable()
export class ConfirmAppointmentValidationService extends ValidationService<unknown, ConfirmAppointmentCommand> {
  protected schema = ConfirmAppointmentCommandSchema;
}

/**
 * Validation service for CancelAppointmentCommand
 * Encapsulates validation logic for cancelling appointments
 */
@injectable()
export class CancelAppointmentValidationService extends ValidationService<unknown, CancelAppointmentCommand> {
  protected schema = CancelAppointmentCommandSchema;
}

/**
 * Validation service for CompleteAppointmentCommand
 * Encapsulates validation logic for completing appointments
 */
@injectable()
export class CompleteAppointmentValidationService extends ValidationService<unknown, CompleteAppointmentCommand> {
  protected schema = CompleteAppointmentCommandSchema;
}

/**
 * Validation service for RescheduleAppointmentCommand
 * Encapsulates validation logic for rescheduling appointments
 */
@injectable()
export class RescheduleAppointmentValidationService extends ValidationService<unknown, RescheduleAppointmentCommand> {
  protected schema = RescheduleAppointmentCommandSchema;
}

/**
 * Composite validation service that provides all Appointment validation operations
 * Follows the Facade pattern to provide a unified interface for Appointment validation
 */
@injectable()
export class AppointmentValidationService {
  constructor(
    @inject(TOKENS.CreateAppointmentValidationService)
    private createValidator: CreateAppointmentValidationService,
    @inject(TOKENS.UpdateAppointmentValidationService)
    private updateValidator: UpdateAppointmentValidationService,
    @inject(TOKENS.ConfirmAppointmentValidationService)
    private confirmValidator: ConfirmAppointmentValidationService,
    @inject(TOKENS.CancelAppointmentValidationService)
    private cancelValidator: CancelAppointmentValidationService,
    @inject(TOKENS.CompleteAppointmentValidationService)
    private completeValidator: CompleteAppointmentValidationService,
    @inject(TOKENS.RescheduleAppointmentValidationService)
    private rescheduleValidator: RescheduleAppointmentValidationService
  ) {}

  /**
   * Validates data for creating a new appointment
   */
  validateCreateCommand(data: unknown): CreateAppointmentCommand {
    return this.createValidator.validate(data);
  }

  /**
   * Validates data for updating an existing appointment
   */
  validateUpdateCommand(data: unknown): UpdateAppointmentCommand {
    return this.updateValidator.validate(data);
  }

  /**
   * Validates data for confirming an appointment
   */
  validateConfirmCommand(data: unknown): ConfirmAppointmentCommand {
    return this.confirmValidator.validate(data);
  }

  /**
   * Validates data for cancelling an appointment
   */
  validateCancelCommand(data: unknown): CancelAppointmentCommand {
    return this.cancelValidator.validate(data);
  }

  /**
   * Validates data for completing an appointment
   */
  validateCompleteCommand(data: unknown): CompleteAppointmentCommand {
    return this.completeValidator.validate(data);
  }

  /**
   * Validates data for rescheduling an appointment
   */
  validateRescheduleCommand(data: unknown): RescheduleAppointmentCommand {
    return this.rescheduleValidator.validate(data);
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

  safeValidateConfirmCommand(data: unknown) {
    return this.confirmValidator.safeParse(data);
  }

  safeValidateCancelCommand(data: unknown) {
    return this.cancelValidator.safeParse(data);
  }

  safeValidateCompleteCommand(data: unknown) {
    return this.completeValidator.safeParse(data);
  }

  safeValidateRescheduleCommand(data: unknown) {
    return this.rescheduleValidator.safeParse(data);
  }
}

// Export interfaces for dependency injection
export type ICreateAppointmentValidationService = IValidationService<unknown, CreateAppointmentCommand>;
export type IUpdateAppointmentValidationService = IValidationService<unknown, UpdateAppointmentCommand>;
export type IConfirmAppointmentValidationService = IValidationService<unknown, ConfirmAppointmentCommand>;
export type ICancelAppointmentValidationService = IValidationService<unknown, CancelAppointmentCommand>;
export type ICompleteAppointmentValidationService = IValidationService<unknown, CompleteAppointmentCommand>;
export type IRescheduleAppointmentValidationService = IValidationService<unknown, RescheduleAppointmentCommand>;