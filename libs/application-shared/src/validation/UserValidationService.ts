import { injectable, inject } from 'tsyringe';
import { ValidationService, IValidationService, ValidationError } from './ValidationService';
import { RegisterUserCommandSchema, LoginUserCommandSchema } from './UserValidationSchemas';
import { RegisterUserCommand, LoginUserCommand } from '../dto/UserCommands';
import { LoginUserRequestDto } from '../dto/UserRequestDtos';
import { TOKENS } from '../di/tokens';

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
        'Validation failed for LoginUserValidationService'
      );
    }

    const request = data as any;

    // Transform LoginUserRequestDto to LoginUserCommand
    // The API expects either email OR username, we convert to unified identifier
    let identifier: string | undefined;

    if (request.email && typeof request.email === 'string') {
      identifier = request.email;
    } else if (request.username && typeof request.username === 'string') {
      identifier = request.username;
    } else if (!request.email && !request.username) {
      // Only throw custom error if both are missing/empty, let Zod handle undefined values
      throw new ValidationError(
        [{ code: 'invalid_type', path: ['email'], message: 'Email or username is required' }],
        'Validation failed for LoginUserValidationService'
      );
    }

    // Create the command object and let Zod validate it
    // This allows Zod to generate proper "expected string, received undefined" messages
    const command = {
      identifier: identifier?.trim(),
      password: request.password
    };

    // Validate the transformed command using the schema
    // This will handle missing password with proper Zod error messages
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

