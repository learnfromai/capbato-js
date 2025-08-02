/**
 * Base domain exception
 */
export abstract class DomainException extends Error {
  constructor(
    message: string, 
    public readonly code: string, 
    public readonly statusCode = 400
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Todo-specific domain exceptions
 */
export class TodoNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Todo with ID ${id} not found`, 'TODO_NOT_FOUND', 404);
  }
}

export class TodoAlreadyCompletedException extends DomainException {
  constructor() {
    super('Todo is already completed', 'TODO_ALREADY_COMPLETED');
  }
}

export class InvalidTodoTitleException extends DomainException {
  constructor(reason: string) {
    super(`Invalid todo title: ${reason}`, 'INVALID_TODO_TITLE');
  }
}

export class InvalidTodoPriorityException extends DomainException {
  constructor(priority: string) {
    super(`Invalid todo priority: ${priority}`, 'INVALID_TODO_PRIORITY');
  }
}

/**
 * User-specific domain exceptions
 */
export class UserNotFoundException extends DomainException {
  constructor(identifier: string) {
    super(`User with identifier ${identifier} not found`, 'USER_NOT_FOUND', 404);
  }
}

export class UserEmailAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(`This email address is already registered`, 'REG_EMAIL_EXISTS', 409);
  }
}

export class UserUsernameAlreadyExistsException extends DomainException {
  constructor(username: string) {
    super(`Username already taken`, 'REG_USERNAME_EXISTS', 409);
  }
}

export class InvalidUserEmailException extends DomainException {
  constructor(reason: string) {
    super(`${reason}`, 'REG_INVALID_EMAIL');
  }
}

export class InvalidUserPasswordException extends DomainException {
  constructor(reason: string) {
    super(`${reason}`, 'REG_WEAK_PASSWORD');
  }
}

export class InvalidUserNameException extends DomainException {
  constructor(reason: string) {
    super(`${reason}`, 'REG_INVALID_NAME');
  }
}

export class MissingRequiredFieldException extends DomainException {
  constructor(field: string, errorCode: string) {
    super(`${field} is required`, errorCode);
  }
}

/**
 * Authentication-specific domain exceptions
 */
export class AuthInvalidCredentialsException extends DomainException {
  constructor() {
    super('Invalid email/username or password', 'AUTH_INVALID_CREDENTIALS', 401);
  }
}

export class AuthMissingIdentifierException extends DomainException {
  constructor() {
    super('Email or username is required', 'AUTH_MISSING_IDENTIFIER', 400);
  }
}

export class AuthMissingPasswordException extends DomainException {
  constructor() {
    super('Password is required', 'AUTH_MISSING_PASSWORD', 400);
  }
}

export class AuthInvalidEmailException extends DomainException {
  constructor() {
    super('Please provide a valid email address', 'AUTH_INVALID_EMAIL', 400);
  }
}

export class InvalidRoleException extends DomainException {
  constructor(reason: string) {
    super(`${reason}`, 'INVALID_ROLE');
  }
}

/**
 * Doctor-specific domain exceptions
 */
export class DoctorNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Doctor with ID ${id} not found`, 'DOCTOR_NOT_FOUND', 404);
  }
}

export class InvalidDoctorNameException extends DomainException {
  constructor(reason: string) {
    super(`Invalid doctor name: ${reason}`, 'INVALID_DOCTOR_NAME');
  }
}

export class InvalidSpecializationException extends DomainException {
  constructor(reason: string) {
    super(`Invalid specialization: ${reason}`, 'INVALID_SPECIALIZATION');
  }
}

export class InvalidContactNumberException extends DomainException {
  constructor(reason: string) {
    super(`Invalid contact number: ${reason}`, 'INVALID_CONTACT_NUMBER');
  }
}

/**
 * Schedule-specific domain exceptions
 */
export class ScheduleNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Schedule with ID ${id} not found`, 'SCHEDULE_NOT_FOUND', 404);
  }
}

export class InvalidScheduleDateException extends DomainException {
  constructor(reason: string) {
    super(`Invalid schedule date: ${reason}`, 'INVALID_SCHEDULE_DATE');
  }
}

export class InvalidScheduleTimeException extends DomainException {
  constructor(reason: string) {
    super(`Invalid schedule time: ${reason}`, 'INVALID_SCHEDULE_TIME');
  }
}

export class InvalidDoctorNameForScheduleException extends DomainException {
  constructor(reason: string) {
    super(`Invalid doctor name for schedule: ${reason}`, 'INVALID_DOCTOR_NAME_FOR_SCHEDULE');
  }
}

export class InvalidDoctorIdForScheduleException extends DomainException {
  constructor(reason: string) {
    super(`Invalid doctor ID for schedule: ${reason}`, 'INVALID_DOCTOR_ID_FOR_SCHEDULE');
  }
}

export class DoctorNotFoundForScheduleException extends DomainException {
  constructor(doctorId: string) {
    super(`Doctor with ID ${doctorId} not found for schedule`, 'DOCTOR_NOT_FOUND_FOR_SCHEDULE', 404);
  }
}

export class ScheduleConflictException extends DomainException {
  constructor(doctorName: string, date: string, time: string) {
    super(
      `Schedule conflict: Dr. ${doctorName} already has a conflicting appointment on ${date} around ${time}`, 
      'SCHEDULE_CONFLICT', 
      409
    );
  }
}

export class PastScheduleException extends DomainException {
  constructor() {
    super('Cannot create or modify schedules for past dates/times', 'PAST_SCHEDULE', 400);
  }
}

export class InvalidScheduleIdException extends DomainException {
  constructor(reason: string) {
    super(`Invalid schedule ID: ${reason}`, 'INVALID_SCHEDULE_ID');
  }
}

/**
 * Appointment-specific domain exceptions
 */
export class InvalidAppointmentIdException extends DomainException {
  constructor(message: string = 'Invalid appointment ID') {
    super(message, 'INVALID_APPOINTMENT_ID', 400);
  }
}

export class AppointmentNotFoundException extends DomainException {
  constructor(message: string = 'Appointment not found') {
    super(message, 'APPOINTMENT_NOT_FOUND', 404);
  }
}

export class AppointmentAlreadyConfirmedException extends DomainException {
  constructor(message: string = 'Appointment is already confirmed') {
    super(message, 'APPOINTMENT_ALREADY_CONFIRMED', 400);
  }
}

export class AppointmentAlreadyCancelledException extends DomainException {
  constructor(message: string = 'Appointment is already cancelled') {
    super(message, 'APPOINTMENT_ALREADY_CANCELLED', 400);
  }
}

export class PastAppointmentDateException extends DomainException {
  constructor(message: string = 'Cannot create appointment for past date') {
    super(message, 'PAST_APPOINTMENT_DATE', 400);
  }
}

export class InvalidAppointmentTimeException extends DomainException {
  constructor(message: string = 'Invalid appointment time format') {
    super(message, 'INVALID_APPOINTMENT_TIME', 400);
  }
}

export class InvalidAppointmentStatusException extends DomainException {
  constructor(message: string = 'Invalid appointment status') {
    super(message, 'INVALID_APPOINTMENT_STATUS', 400);
  }
}

export class TimeSlotUnavailableException extends DomainException {
  constructor(message: string = 'Time slot is already booked') {
    super(message, 'TIME_SLOT_UNAVAILABLE', 409);
  }
}

export class DuplicateAppointmentException extends DomainException {
  constructor(message: string = 'Patient already has an appointment on this date') {
    super(message, 'DUPLICATE_APPOINTMENT', 409);
  }
}

export class PatientNotExistsException extends DomainException {
  constructor(message: string = 'Patient does not exist in the database') {
    super(message, 'PATIENT_NOT_EXISTS', 400);
  }
}
