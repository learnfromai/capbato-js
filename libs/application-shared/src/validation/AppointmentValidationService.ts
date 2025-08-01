import { injectable, inject } from 'tsyringe';
import { ValidationService, IValidationService } from './ValidationService';
import { TOKENS } from '../di/tokens';
import {
  CreateAppointmentCommandSchema,
  UpdateAppointmentCommandSchema,
  CancelAppointmentCommandSchema,
  ConfirmAppointmentCommandSchema,
  DeleteAppointmentCommandSchema,
  GetAppointmentByIdQuerySchema,
  GetAppointmentsByPatientIdQuerySchema,
  CreateAppointmentCommand,
  UpdateAppointmentCommand,
  CancelAppointmentCommand,
  ConfirmAppointmentCommand,
  DeleteAppointmentCommand,
  GetAppointmentByIdQuery,
  GetAppointmentsByPatientIdQuery,
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
 * Validation service for CancelAppointmentCommand
 * Encapsulates validation logic for cancelling appointments
 */
@injectable()
export class CancelAppointmentValidationService extends ValidationService<unknown, CancelAppointmentCommand> {
  protected schema = CancelAppointmentCommandSchema;
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
 * Validation service for DeleteAppointmentCommand
 * Encapsulates validation logic for deleting appointments
 */
@injectable()
export class DeleteAppointmentValidationService extends ValidationService<unknown, DeleteAppointmentCommand> {
  protected schema = DeleteAppointmentCommandSchema;
}

/**
 * Validation service for GetAppointmentByIdQuery
 * Encapsulates validation logic for appointment ID queries
 */
@injectable()
export class GetAppointmentByIdValidationService extends ValidationService<unknown, GetAppointmentByIdQuery> {
  protected schema = GetAppointmentByIdQuerySchema;
}

/**
 * Validation service for GetAppointmentsByPatientIdQuery
 * Encapsulates validation logic for patient appointment queries
 */
@injectable()
export class GetAppointmentsByPatientIdValidationService extends ValidationService<unknown, GetAppointmentsByPatientIdQuery> {
  protected schema = GetAppointmentsByPatientIdQuerySchema;
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
    @inject(TOKENS.CancelAppointmentValidationService)
    private cancelValidator: CancelAppointmentValidationService,
    @inject(TOKENS.ConfirmAppointmentValidationService)
    private confirmValidator: ConfirmAppointmentValidationService,
    @inject(TOKENS.DeleteAppointmentValidationService)
    private deleteValidator: DeleteAppointmentValidationService,
    @inject(TOKENS.GetAppointmentByIdValidationService)
    private getByIdValidator: GetAppointmentByIdValidationService,
    @inject(TOKENS.GetAppointmentsByPatientIdValidationService)
    private getByPatientIdValidator: GetAppointmentsByPatientIdValidationService
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
   * Validates data for cancelling an appointment
   */
  validateCancelCommand(data: unknown): CancelAppointmentCommand {
    return this.cancelValidator.validate(data);
  }

  /**
   * Validates data for confirming an appointment
   */
  validateConfirmCommand(data: unknown): ConfirmAppointmentCommand {
    return this.confirmValidator.validate(data);
  }

  /**
   * Validates data for deleting an appointment
   */
  validateDeleteCommand(data: unknown): DeleteAppointmentCommand {
    return this.deleteValidator.validate(data);
  }

  /**
   * Validates data for getting appointment by ID
   */
  validateGetByIdQuery(data: unknown): GetAppointmentByIdQuery {
    return this.getByIdValidator.validate(data);
  }

  /**
   * Validates data for getting appointments by patient ID
   */
  validateGetByPatientIdQuery(data: unknown): GetAppointmentsByPatientIdQuery {
    return this.getByPatientIdValidator.validate(data);
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

  safeValidateCancelCommand(data: unknown) {
    return this.cancelValidator.safeParse(data);
  }

  safeValidateConfirmCommand(data: unknown) {
    return this.confirmValidator.safeParse(data);
  }

  safeValidateDeleteCommand(data: unknown) {
    return this.deleteValidator.safeParse(data);
  }

  safeValidateGetByIdQuery(data: unknown) {
    return this.getByIdValidator.safeParse(data);
  }

  safeValidateGetByPatientIdQuery(data: unknown) {
    return this.getByPatientIdValidator.safeParse(data);
  }
}

// Export interfaces for dependency injection
export type ICreateAppointmentValidationService = IValidationService<unknown, CreateAppointmentCommand>;
export type IUpdateAppointmentValidationService = IValidationService<unknown, UpdateAppointmentCommand>;
export type ICancelAppointmentValidationService = IValidationService<unknown, CancelAppointmentCommand>;
export type IConfirmAppointmentValidationService = IValidationService<unknown, ConfirmAppointmentCommand>;
export type IDeleteAppointmentValidationService = IValidationService<unknown, DeleteAppointmentCommand>;
export type IGetAppointmentByIdValidationService = IValidationService<unknown, GetAppointmentByIdQuery>;
export type IGetAppointmentsByPatientIdValidationService = IValidationService<unknown, GetAppointmentsByPatientIdQuery>;