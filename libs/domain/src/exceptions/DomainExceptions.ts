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
 * Appointment-specific domain exceptions
 */
export class AppointmentNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Appointment with ID ${id} not found`, 'APPOINTMENT_NOT_FOUND', 404);
  }
}

export class InvalidAppointmentDateException extends DomainException {
  constructor(reason: string) {
    super(`Invalid appointment date: ${reason}`, 'INVALID_APPOINTMENT_DATE');
  }
}

export class InvalidAppointmentTimeException extends DomainException {
  constructor(reason: string) {
    super(`Invalid appointment time: ${reason}`, 'INVALID_APPOINTMENT_TIME');
  }
}

export class InvalidAppointmentStatusException extends DomainException {
  constructor(reason: string) {
    super(`Invalid appointment status: ${reason}`, 'INVALID_APPOINTMENT_STATUS');
  }
}

export class AppointmentAlreadyConfirmedException extends DomainException {
  constructor() {
    super('Appointment is already confirmed', 'APPOINTMENT_ALREADY_CONFIRMED');
  }
}

export class AppointmentAlreadyCompletedException extends DomainException {
  constructor() {
    super('Appointment is already completed', 'APPOINTMENT_ALREADY_COMPLETED');
  }
}

export class AppointmentAlreadyCancelledException extends DomainException {
  constructor() {
    super('Appointment is already cancelled', 'APPOINTMENT_ALREADY_CANCELLED');
  }
}

export class TimeSlotNotAvailableException extends DomainException {
  constructor(date: string, time: string) {
    super(`Time slot ${time} on ${date} is not available`, 'TIME_SLOT_NOT_AVAILABLE', 409);
  }
}

export class DuplicateAppointmentException extends DomainException {
  constructor(patientId: string, date: string) {
    super(`Patient ${patientId} already has an appointment on ${date}`, 'DUPLICATE_APPOINTMENT', 409);
  }
}

export class PastAppointmentException extends DomainException {
  constructor() {
    super('Cannot book appointment for a past date or time', 'PAST_APPOINTMENT_NOT_ALLOWED');
  }
}

export class InvalidAppointmentTransitionException extends DomainException {
  constructor(from: string, to: string) {
    super(`Cannot transition appointment from ${from} to ${to}`, 'INVALID_APPOINTMENT_TRANSITION');
  }
}

export class PatientNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Patient with ID ${id} not found`, 'PATIENT_NOT_FOUND', 404);
  }
}

export class InvalidReasonForVisitException extends DomainException {
  constructor(reason: string) {
    super(`Invalid reason for visit: ${reason}`, 'INVALID_REASON_FOR_VISIT');
  }
}
