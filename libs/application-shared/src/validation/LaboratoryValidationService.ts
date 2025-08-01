import { injectable, inject } from 'tsyringe';
import { ValidationService } from './ValidationService';
import { TOKENS } from '../di/tokens';
import {
  CreateLabRequestCommandSchema,
  UpdateLabRequestResultsCommandSchema,
  GetLabRequestByPatientIdCommandSchema,
  DeleteLabRequestCommandSchema,
  CreateBloodChemistryCommandSchema,
  DeleteBloodChemistryCommandSchema,
  CreateLabRequestCommand,
  UpdateLabRequestResultsCommand,
  GetLabRequestByPatientIdCommand,
  DeleteLabRequestCommand,
  CreateBloodChemistryCommand,
  DeleteBloodChemistryCommand,
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
 * Validation service for UpdateLabRequestResultsCommand
 * Encapsulates validation logic for updating lab request results
 */
@injectable()
export class UpdateLabRequestResultsValidationService extends ValidationService<unknown, UpdateLabRequestResultsCommand> {
  protected schema = UpdateLabRequestResultsCommandSchema;
}

/**
 * Validation service for GetLabRequestByPatientIdCommand
 * Encapsulates validation logic for getting lab requests by patient ID
 */
@injectable()
export class GetLabRequestByPatientIdValidationService extends ValidationService<unknown, GetLabRequestByPatientIdCommand> {
  protected schema = GetLabRequestByPatientIdCommandSchema;
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
 * Encapsulates validation logic for creating new blood chemistry results
 */
@injectable()
export class CreateBloodChemistryValidationService extends ValidationService<unknown, CreateBloodChemistryCommand> {
  protected schema = CreateBloodChemistryCommandSchema;
}

/**
 * Validation service for DeleteBloodChemistryCommand
 * Encapsulates validation logic for deleting blood chemistry results
 */
@injectable()
export class DeleteBloodChemistryValidationService extends ValidationService<unknown, DeleteBloodChemistryCommand> {
  protected schema = DeleteBloodChemistryCommandSchema;
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
    @inject(TOKENS.UpdateLabRequestResultsValidationService)
    private updateLabRequestResultsValidator: UpdateLabRequestResultsValidationService,
    @inject(TOKENS.GetLabRequestByPatientIdValidationService)
    private getLabRequestByPatientIdValidator: GetLabRequestByPatientIdValidationService,
    @inject(TOKENS.DeleteLabRequestValidationService)
    private deleteLabRequestValidator: DeleteLabRequestValidationService,
    @inject(TOKENS.CreateBloodChemistryValidationService)
    private createBloodChemistryValidator: CreateBloodChemistryValidationService,
    @inject(TOKENS.DeleteBloodChemistryValidationService)
    private deleteBloodChemistryValidator: DeleteBloodChemistryValidationService
  ) {}

  /**
   * Validates data for creating a new lab request
   */
  validateCreateLabRequestCommand(data: unknown): CreateLabRequestCommand {
    return this.createLabRequestValidator.validate(data);
  }

  /**
   * Validates data for updating lab request results
   */
  validateUpdateLabRequestResultsCommand(data: unknown): UpdateLabRequestResultsCommand {
    return this.updateLabRequestResultsValidator.validate(data);
  }

  /**
   * Validates data for getting lab request by patient ID
   */
  validateGetLabRequestByPatientIdCommand(data: unknown): GetLabRequestByPatientIdCommand {
    return this.getLabRequestByPatientIdValidator.validate(data);
  }

  /**
   * Validates data for deleting a lab request
   */
  validateDeleteLabRequestCommand(data: unknown): DeleteLabRequestCommand {
    return this.deleteLabRequestValidator.validate(data);
  }

  /**
   * Validates data for creating a new blood chemistry result
   */
  validateCreateBloodChemistryCommand(data: unknown): CreateBloodChemistryCommand {
    return this.createBloodChemistryValidator.validate(data);
  }

  /**
   * Validates data for deleting a blood chemistry result
   */
  validateDeleteBloodChemistryCommand(data: unknown): DeleteBloodChemistryCommand {
    return this.deleteBloodChemistryValidator.validate(data);
  }

  /**
   * Safe validation methods that don't throw exceptions
   */
  safeValidateCreateLabRequestCommand(data: unknown) {
    return this.createLabRequestValidator.safeValidate(data);
  }

  safeValidateUpdateLabRequestResultsCommand(data: unknown) {
    return this.updateLabRequestResultsValidator.safeValidate(data);
  }

  safeValidateGetLabRequestByPatientIdCommand(data: unknown) {
    return this.getLabRequestByPatientIdValidator.safeValidate(data);
  }

  safeValidateDeleteLabRequestCommand(data: unknown) {
    return this.deleteLabRequestValidator.safeValidate(data);
  }

  safeValidateCreateBloodChemistryCommand(data: unknown) {
    return this.createBloodChemistryValidator.safeValidate(data);
  }

  safeValidateDeleteBloodChemistryCommand(data: unknown) {
    return this.deleteBloodChemistryValidator.safeValidate(data);
  }
}