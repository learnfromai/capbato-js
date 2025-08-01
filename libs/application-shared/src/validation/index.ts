// Validation schemas and types
export * from './TodoValidationSchemas';

// Base validation service and utilities
export * from './ValidationService';

// Concrete validation service implementations
export * from './TodoValidationService';

// Note: Custom decorators for routing-controllers were removed in favor of manual validation

// Re-export commonly used validation schemas for convenience
export {
  CreateTodoCommandSchema,
  UpdateTodoCommandSchema,
  DeleteTodoCommandSchema,
  ToggleTodoCommandSchema,
  TodoIdSchema,
  TodoValidationSchemas,
} from './TodoValidationSchemas';

// Re-export user validation schemas for convenience
export {
  RegisterUserCommandSchema,
  LoginUserCommandSchema,
  LoginFormSchema,
  ChangeUserPasswordCommandSchema,
  ChangePasswordFormSchema,
  GetAllUsersQuerySchema,
  UpdateDoctorScheduleCommandSchema,
  FirstNameSchema,
  LastNameSchema,
  EmailSchema,
  PasswordSchema,
  NameSchema,
  MobileSchema,
  RoleSchema,
  UserValidationSchemas,
  USER_VALIDATION_ERRORS,
} from './UserValidationSchemas';

// Note: All validation service tokens are now in centralized TOKENS object from '../di/tokens'

// Export user validation schemas and services
export * from './UserValidationSchemas';
export * from './UserValidationService';

// Export patient validation schemas and services
export * from './PatientValidationSchemas';
export * from './PatientValidationService';