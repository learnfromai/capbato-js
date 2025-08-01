import { z } from 'zod';

/**
 * User validation schemas
 * Contains all validation rules and error messages as specified in requirements
 */

// Custom error messages as per requirements
export const USER_VALIDATION_ERRORS = {
  REG_MISSING_FIRSTNAME: 'First name is required',
  REG_MISSING_LASTNAME: 'Last name is required', 
  REG_MISSING_EMAIL: 'Email address is required',
  REG_MISSING_PASSWORD: 'Password is required',
  REG_MISSING_ROLE: 'Role is required',
  REG_INVALID_EMAIL: 'Please provide a valid email address',
  REG_WEAK_PASSWORD: 'Password must be at least 8 characters long with at least one uppercase letter, one lowercase letter, and one number',
  REG_INVALID_ROLE: 'Role must be one of: admin, doctor, receptionist',
  REG_EMAIL_EXISTS: 'This email address is already registered',
  REG_INVALID_NAME: 'Names can only contain letters, spaces, and hyphens',
  REG_INVALID_MOBILE: 'Please provide a valid Philippine mobile number (09xxxxxxxxx or +639xxxxxxxxx)',
  AUTH_MISSING_IDENTIFIER: 'Email or username is required',
  AUTH_MISSING_PASSWORD: 'Password is required',
  AUTH_INVALID_EMAIL: 'Please provide a valid email address',
  SCHEDULE_MISSING_DOCTOR_NAME: 'Doctor name is required',
  SCHEDULE_MISSING_DATE: 'Date is required',
  SCHEDULE_MISSING_TIME: 'Time is required',
  SCHEDULE_INVALID_DATE: 'Please provide a valid date',
  SCHEDULE_INVALID_TIME: 'Please provide a valid time format (e.g., 9AM - 5PM)'
} as const;

// Name validation schema (for firstName and lastName)
export const NameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(50, 'Name cannot exceed 50 characters')
  .regex(/^[a-zA-ZñÑ\s-]+$/, USER_VALIDATION_ERRORS.REG_INVALID_NAME);

// First name validation
export const FirstNameSchema = z
  .string()
  .min(1, USER_VALIDATION_ERRORS.REG_MISSING_FIRSTNAME)
  .max(50, 'Name cannot exceed 50 characters')
  .regex(/^[a-zA-ZñÑ\s-]+$/, USER_VALIDATION_ERRORS.REG_INVALID_NAME);

// Last name validation  
export const LastNameSchema = z
  .string()
  .min(1, USER_VALIDATION_ERRORS.REG_MISSING_LASTNAME)
  .max(50, 'Name cannot exceed 50 characters')
  .regex(/^[a-zA-ZñÑ\s-]+$/, USER_VALIDATION_ERRORS.REG_INVALID_NAME);

// Email validation schema
export const EmailSchema = z
  .string()
  .min(1, USER_VALIDATION_ERRORS.REG_MISSING_EMAIL)
  .email(USER_VALIDATION_ERRORS.REG_INVALID_EMAIL)
  .max(254, 'Email address is too long');

// Password validation schema  
export const PasswordSchema = z
  .string()
  .min(1, USER_VALIDATION_ERRORS.REG_MISSING_PASSWORD)
  .min(8, USER_VALIDATION_ERRORS.REG_WEAK_PASSWORD)
  .regex(/[A-Z]/, USER_VALIDATION_ERRORS.REG_WEAK_PASSWORD)
  .regex(/[a-z]/, USER_VALIDATION_ERRORS.REG_WEAK_PASSWORD)
  .regex(/[0-9]/, USER_VALIDATION_ERRORS.REG_WEAK_PASSWORD);

// Mobile validation schema for Philippine numbers
export const MobileSchema = z
  .string()
  .optional()
  .refine((value) => {
    if (!value) return true; // Optional field
    const cleanMobile = value.replace(/[\s\-()]/g, '');
    // Philippine mobile: 09xxxxxxxxx or +639xxxxxxxxx
    return /^(\+639|09)\d{9}$/.test(cleanMobile);
  }, {
    message: USER_VALIDATION_ERRORS.REG_INVALID_MOBILE,
  });

// Role validation schema
export const RoleSchema = z
  .string()
  .min(1, USER_VALIDATION_ERRORS.REG_MISSING_ROLE)
  .refine((value) => ['admin', 'doctor', 'receptionist'].includes(value.toLowerCase()), {
    message: USER_VALIDATION_ERRORS.REG_INVALID_ROLE,
  });

// Register user command validation schema
export const RegisterUserCommandSchema = z.object({
  firstName: FirstNameSchema,
  lastName: LastNameSchema,
  email: EmailSchema,
  password: PasswordSchema,
  role: RoleSchema,
  mobile: MobileSchema,
});

// Login user command validation schema (matches DTO interface)
export const LoginUserCommandSchema = z.object({
  identifier: z
    .string()
    .min(1, USER_VALIDATION_ERRORS.AUTH_MISSING_IDENTIFIER)
    .refine((value) => {
      // If it looks like an email (contains @), validate email format
      if (value.includes('@')) {
        return z.string().email().safeParse(value).success;
      }
      // Otherwise, it's a username - just check it's not empty (already checked by min(1))
      return true;
    }, {
      message: USER_VALIDATION_ERRORS.AUTH_INVALID_EMAIL,
    }),
  password: z
    .string()
    .min(1, USER_VALIDATION_ERRORS.AUTH_MISSING_PASSWORD),
});

// Frontend form schema extends the command schema with UI-specific fields
export const LoginFormSchema = LoginUserCommandSchema.extend({
  rememberMe: z.boolean().optional(),
});

// Change password command validation schema
export const ChangeUserPasswordCommandSchema = z.object({
  userId: z.string().min(1, 'User ID is required').uuid('Invalid user ID format'),
  newPassword: PasswordSchema,
});

// Change password form validation schema (with confirmation)
export const ChangePasswordFormSchema = z.object({
  newPassword: PasswordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Get all users query schema (empty object)  
export const GetAllUsersQuerySchema = z.object({});

// Doctor Schedule validation schemas
export const UpdateDoctorScheduleCommandSchema = z.object({
  doctorName: z
    .string()
    .min(1, USER_VALIDATION_ERRORS.SCHEDULE_MISSING_DOCTOR_NAME)
    .max(100, 'Doctor name cannot exceed 100 characters'),
  date: z
    .string()
    .min(1, USER_VALIDATION_ERRORS.SCHEDULE_MISSING_DATE)
    .regex(/^\d{4}-\d{2}-\d{2}$/, USER_VALIDATION_ERRORS.SCHEDULE_INVALID_DATE),
  time: z
    .string()
    .min(1, USER_VALIDATION_ERRORS.SCHEDULE_MISSING_TIME)
    .max(50, 'Time cannot exceed 50 characters')
});

// Export all schemas for easy access
export const UserValidationSchemas = {
  RegisterUserCommand: RegisterUserCommandSchema,
  LoginUserCommand: LoginUserCommandSchema,
  LoginForm: LoginFormSchema,
  ChangeUserPasswordCommand: ChangeUserPasswordCommandSchema,
  ChangePasswordForm: ChangePasswordFormSchema,
  GetAllUsersQuery: GetAllUsersQuerySchema,
  UpdateDoctorScheduleCommand: UpdateDoctorScheduleCommandSchema,
  FirstName: FirstNameSchema,
  LastName: LastNameSchema,
  Email: EmailSchema,
  Password: PasswordSchema,
  Name: NameSchema,
  Mobile: MobileSchema,
  Role: RoleSchema,
} as const;