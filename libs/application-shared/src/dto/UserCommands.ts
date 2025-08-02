/**
 * User Command DTOs
 * Commands for user-related operations following CQRS pattern
 */

export interface RegisterUserCommand {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  mobile?: string;
  // Doctor profile fields (optional, only required when role is 'doctor')
  specialization?: string;
  licenseNumber?: string;
  experienceYears?: number;
}

export interface LoginUserCommand {
  identifier: string; // Can be email or username
  password: string;
}

// Query type for getting all users
export type GetAllUsersQuery = Record<string, never>;

export interface ChangeUserPasswordCommand {
  userId: string;
  newPassword: string;
}