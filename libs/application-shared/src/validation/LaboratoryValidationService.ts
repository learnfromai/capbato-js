import { injectable, inject } from 'tsyringe';
import { ValidationService } from './ValidationService';
import { TOKENS } from '../di/tokens';
import {
  CreateLabRequestCommandSchema,
  UpdateLabRequestCommandSchema,
  DeleteLabRequestCommandSchema,
  CreateBloodChemistryCommandSchema,
  GetLabRequestByPatientIdSchema,
  GetLabRequestByIdSchema,
  LabRequestIdSchema,
  CreateLabRequestCommand,
  UpdateLabRequestCommand,
  DeleteLabRequestCommand,
  CreateBloodChemistryCommand,
  GetLabRequestByPatientIdQuery,
  GetLabRequestByIdQuery,
} from './LaboratoryValidationSchemas';

/**
 * Validation service for CreateLabRequestCommand
 * Encapsulates validation logic for creating new lab requests
 */
@injectable()
export class CreateLabRequestValidationService extends ValidationService<unknown, CreateLabRequestCommand> {
  protected schema = CreateLabRequestCommandSchema;
}

/**
 * Validation service for UpdateLabRequestCommand
 * Encapsulates validation logic for updating existing lab requests
 */
@injectable()
export class UpdateLabRequestValidationService extends ValidationService<unknown, UpdateLabRequestCommand> {
  protected schema = UpdateLabRequestCommandSchema;
}

/**
 * Validation service for DeleteLabRequestCommand
 * Encapsulates validation logic for deleting lab requests
 */
@injectable()
export class DeleteLabRequestValidationService extends ValidationService<unknown, DeleteLabRequestCommand> {
  protected schema = DeleteLabRequestCommandSchema;
}

/**
 * Validation service for CreateBloodChemistryCommand
 * Encapsulates validation logic for creating blood chemistry records
 */
@injectable()
export class CreateBloodChemistryValidationService extends ValidationService<unknown, CreateBloodChemistryCommand> {
  protected schema = CreateBloodChemistryCommandSchema;
}

/**
 * Validation service for GetLabRequestByPatientIdQuery
 * Encapsulates validation logic for querying lab requests by patient ID
 */
@injectable()
export class GetLabRequestByPatientIdValidationService extends ValidationService<unknown, GetLabRequestByPatientIdQuery> {
  protected schema = GetLabRequestByPatientIdSchema;
}

/**
 * Validation service for GetLabRequestByIdQuery
 * Encapsulates validation logic for querying lab requests by ID
 */
@injectable()
export class GetLabRequestByIdValidationService extends ValidationService<unknown, GetLabRequestByIdQuery> {
  protected schema = GetLabRequestByIdSchema;
}

/**
 * Validation service for LabRequestId parameter
 * Encapsulates validation logic for lab request ID parameters
 */
@injectable()
export class LabRequestIdValidationService extends ValidationService<unknown, string> {
  protected schema = LabRequestIdSchema;
}

/**
 * Composite validation service that provides all Laboratory validation operations
 * Follows the Facade pattern to provide a unified interface for Laboratory validation
 */
@injectable()
export class LaboratoryValidationService {
  constructor(
    @inject(TOKENS.CreateLabRequestValidationService)
    private createLabRequestValidator: CreateLabRequestValidationService,
    @inject(TOKENS.UpdateLabRequestValidationService)
    private updateLabRequestValidator: UpdateLabRequestValidationService,
    @inject(TOKENS.DeleteLabRequestValidationService)
    private deleteLabRequestValidator: DeleteLabRequestValidationService,
    @inject(TOKENS.CreateBloodChemistryValidationService)
    private createBloodChemistryValidator: CreateBloodChemistryValidationService,
    @inject(TOKENS.GetLabRequestByPatientIdValidationService)
    private getLabRequestByPatientIdValidator: GetLabRequestByPatientIdValidationService,
    @inject(TOKENS.GetLabRequestByIdValidationService)
    private getLabRequestByIdValidator: GetLabRequestByIdValidationService,
    @inject(TOKENS.LabRequestIdValidationService)
    private labRequestIdValidator: LabRequestIdValidationService
  ) {}

  /**
   * Validates CreateLabRequestCommand
   */
  validateCreateCommand(data: unknown): CreateLabRequestCommand {
    return this.createLabRequestValidator.validate(data);
  }

  /**
   * Validates UpdateLabRequestCommand
   */
  validateUpdateCommand(data: unknown): UpdateLabRequestCommand {
    return this.updateLabRequestValidator.validate(data);
  }

  /**
   * Validates DeleteLabRequestCommand
   */
  validateDeleteCommand(data: unknown): DeleteLabRequestCommand {
    return this.deleteLabRequestValidator.validate(data);
  }

  /**
   * Validates CreateBloodChemistryCommand
   */
  validateCreateBloodChemistryCommand(data: unknown): CreateBloodChemistryCommand {
    return this.createBloodChemistryValidator.validate(data);
  }

  /**
   * Validates GetLabRequestByPatientIdQuery
   */
  validateGetByPatientIdQuery(data: unknown): GetLabRequestByPatientIdQuery {
    return this.getLabRequestByPatientIdValidator.validate(data);
  }

  /**
   * Validates GetLabRequestByIdQuery
   */
  validateGetByIdQuery(data: unknown): GetLabRequestByIdQuery {
    return this.getLabRequestByIdValidator.validate(data);
  }

  /**
   * Validates lab request ID parameter
   */
  validateLabRequestId(data: unknown): string {
    return this.labRequestIdValidator.validate(data);
  }

  /**
   * Safe validation methods that return validation results without throwing
   */
  safeValidateCreateCommand(data: unknown) {
    return this.createLabRequestValidator.safeValidate(data);
  }

  safeValidateUpdateCommand(data: unknown) {
    return this.updateLabRequestValidator.safeValidate(data);
  }

  safeValidateDeleteCommand(data: unknown) {
    return this.deleteLabRequestValidator.safeValidate(data);
  }

  safeValidateCreateBloodChemistryCommand(data: unknown) {
    return this.createBloodChemistryValidator.safeValidate(data);
  }

  safeValidateGetByPatientIdQuery(data: unknown) {
    return this.getLabRequestByPatientIdValidator.safeValidate(data);
  }

  safeValidateGetByIdQuery(data: unknown) {
    return this.getLabRequestByIdValidator.safeValidate(data);
  }

  safeValidateLabRequestId(data: unknown) {
    return this.labRequestIdValidator.safeValidate(data);
  }
}