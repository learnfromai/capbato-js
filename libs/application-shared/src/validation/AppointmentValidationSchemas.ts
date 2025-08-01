import { z } from 'zod';

/**
 * Appointment validation schemas
 * Contains all validation rules and error messages for appointment operations
 */

// Custom error messages for appointments
export const APPOINTMENT_VALIDATION_ERRORS = {
  MISSING_PATIENT_NAME: 'Patient name is required',
  MISSING_REASON: 'Reason for visit is required',
  MISSING_DATE: 'Appointment date is required',
  MISSING_TIME: 'Appointment time is required',
  MISSING_DOCTOR: 'Doctor selection is required',
  INVALID_DATE: 'Please provide a valid date',
  INVALID_TIME: 'Please select a valid time slot',
  INVALID_REASON: 'Please select a valid reason for visit',
  PAST_DATE: 'Cannot schedule appointments for past dates',
  INVALID_PATIENT_NAME: 'Patient name can only contain letters, spaces, and hyphens'
} as const;

// Valid reasons for visit (matching legacy options)
export const VISIT_REASONS = [
  'Consultation',
  'Laboratory: Blood chemistry',
  'Laboratory: Hematology',
  'Laboratory: Serology & Immunology',
  'Laboratory: Urinalysis',
  'Laboratory: Fecalysis',
  'Prescription',
  'Follow-up check-up',
  'Medical Certificate'
] as const;

// Patient name validation schema
export const PatientNameSchema = z
  .string()
  .min(1, APPOINTMENT_VALIDATION_ERRORS.MISSING_PATIENT_NAME)
  .max(100, 'Patient name cannot exceed 100 characters')
  .regex(/^[a-zA-ZñÑ\s.-]+$/, APPOINTMENT_VALIDATION_ERRORS.INVALID_PATIENT_NAME);

// Reason for visit validation schema
export const ReasonForVisitSchema = z.enum([
  'Consultation',
  'Laboratory: Blood chemistry',
  'Laboratory: Hematology',
  'Laboratory: Serology & Immunology',
  'Laboratory: Urinalysis',
  'Laboratory: Fecalysis',
  'Prescription',
  'Follow-up check-up',
  'Medical Certificate'
], {
  message: APPOINTMENT_VALIDATION_ERRORS.INVALID_REASON,
});

// Date validation schema
export const AppointmentDateSchema = z
  .string()
  .min(1, APPOINTMENT_VALIDATION_ERRORS.MISSING_DATE)
  .regex(/^\d{4}-\d{2}-\d{2}$/, APPOINTMENT_VALIDATION_ERRORS.INVALID_DATE)
  .refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, APPOINTMENT_VALIDATION_ERRORS.PAST_DATE);

// Time validation schema
export const AppointmentTimeSchema = z
  .string()
  .min(1, APPOINTMENT_VALIDATION_ERRORS.MISSING_TIME)
  .regex(/^([0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, APPOINTMENT_VALIDATION_ERRORS.INVALID_TIME);

// Doctor selection validation schema
export const DoctorSelectionSchema = z
  .string()
  .min(1, APPOINTMENT_VALIDATION_ERRORS.MISSING_DOCTOR);

// Create appointment command schema
export const CreateAppointmentCommandSchema = z.object({
  patientName: PatientNameSchema,
  reasonForVisit: ReasonForVisitSchema,
  date: AppointmentDateSchema,
  time: AppointmentTimeSchema,
  doctorId: DoctorSelectionSchema,
});

// Form data schema (allows undefined for initial state)
export const AddAppointmentFormSchema = z.object({
  patientName: z.string().min(0),
  reasonForVisit: ReasonForVisitSchema.optional(),
  date: z.string().min(0),
  time: z.string().min(0),
  doctorId: z.string().min(0),
});

// Type inference for the create appointment command
export type CreateAppointmentCommand = z.infer<typeof CreateAppointmentCommandSchema>;

// Form data type (matches the form structure)
export type AddAppointmentFormData = z.infer<typeof AddAppointmentFormSchema>;

// Container for all appointment validation schemas
export const AppointmentValidationSchemas = {
  CreateAppointmentCommandSchema,
  AddAppointmentFormSchema,
  PatientNameSchema,
  ReasonForVisitSchema,
  AppointmentDateSchema,
  AppointmentTimeSchema,
  DoctorSelectionSchema,
} as const;