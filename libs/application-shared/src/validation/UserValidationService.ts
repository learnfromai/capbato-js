import { injectable, inject } from 'tsyringe';
import { ValidationService, IValidationService, ValidationError } from './ValidationService';
import { RegisterUserCommandSchema, LoginUserCommandSchema } from './UserValidationSchemas';
import { RegisterUserCommand, LoginUserCommand } from '../dto/UserCommands';
import { LoginUserRequestDto } from '../dto/UserRequestDtos';
import { TOKENS } from '../di/tokens';
import { z } from 'zod';

/**
 * Validation service for RegisterUserCommand
 * Encapsulates validation logic for user registration
 */
@injectable()
export class RegisterUserValidationService extends ValidationService<unknown, RegisterUserCommand> {
  protected schema = RegisterUserCommandSchema;
}

/**
 * Validation service for LoginUserCommand
 * Encapsulates validation logic for user login
 */
@injectable()
export class LoginUserValidationService extends ValidationService<unknown, LoginUserCommand> {
  protected schema = LoginUserCommandSchema;
}


/**
 * Composite validation service that provides all User validation operations
 * Follows the Facade pattern to provide a unified interface for User validation
 */
@injectable()
export class UserValidationService {
  constructor(
    @inject(TOKENS.RegisterUserValidationService)
    private registerValidator: RegisterUserValidationService,
    @inject(TOKENS.LoginUserValidationService)
    private loginValidator: LoginUserValidationService
  ) {}

  /**
   * Validates data for registering a new user
   */
  validateRegisterCommand(data: unknown): RegisterUserCommand {
    return this.registerValidator.validate(data);
  }

  /**
   * Validates data for logging in a user
   * Transforms LoginUserRequestDto (email? | username?) to LoginUserCommand (identifier)
   */
  validateLoginCommand(data: unknown): LoginUserCommand {
    // First validate that the data has the required structure
    if (!data || typeof data !== 'object') {
      throw new ValidationError(
        [{ code: 'invalid_type', path: [], message: 'Invalid login data' }],
        'Invalid login data'
      );
    }

    const request = data as any;

    // Transform LoginUserRequestDto to LoginUserCommand
    // The API expects either email OR username, we convert to unified identifier
    let identifier: string | undefined;

    if (request.email !== undefined) {
      // If email is provided, validate its format (but only if it's a non-empty string)
      if (typeof request.email === 'string' && request.email.trim() !== '') {
        if (!z.string().email().safeParse(request.email).success) {
          throw new ValidationError(
            [{ code: 'invalid_email', path: ['email'], message: 'Please provide a valid email address' }],
            'Please provide a valid email address'
          );
        }
        identifier = request.email;
      } else {
        // Let Zod handle empty strings and type validation
        identifier = request.email;
      }
    } else if (request.username !== undefined) {
      identifier = request.username;
    }

    // If neither email nor username is provided, let Zod handle it
    if (identifier === undefined) {
      identifier = '';
    }

    // Create the command object and validate it using the schema
    const command = {
      identifier: typeof identifier === 'string' ? identifier.trim() : identifier,
      password: request.password
    };

    // Let the schema validation handle all validation including missing fields
    return this.loginValidator.validate(command);
  }

  /**
   * Safe validation methods that don't throw exceptions
   */
  safeValidateRegisterCommand(data: unknown) {
    return this.registerValidator.safeParse(data);
  }

  safeValidateLoginCommand(data: unknown) {
    return this.loginValidator.safeParse(data);
  }
}

// Export interfaces for dependency injection
export type IRegisterUserValidationService = IValidationService<unknown, RegisterUserCommand>;
export type ILoginUserValidationService = IValidationService<unknown, LoginUserCommand>;

