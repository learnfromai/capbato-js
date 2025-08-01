import { z } from 'zod';

// Base schemas for reuse
export const AppointmentIdSchema = z.string().min(1, 'Appointment ID is required');

export const PatientIdSchema = z.string().min(1, 'Patient ID is required');

export const PatientNameSchema = z
  .string()
  .min(2, 'Patient name must be at least 2 characters')
  .max(200, 'Patient name cannot exceed 200 characters')
  .regex(/^[a-zA-Z\s\-'.,]+$/, 'Patient name contains invalid characters');

export const ReasonForVisitSchema = z
  .string()  
  .min(3, 'Reason for visit must be at least 3 characters')
  .max(500, 'Reason for visit cannot exceed 500 characters');

export const AppointmentDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Appointment date must be in YYYY-MM-DD format')
  .refine((date) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentDate >= today;
  }, 'Appointment date cannot be in the past');

export const AppointmentTimeSchema = z
  .string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Appointment time must be in HH:MM format');

export const AppointmentStatusSchema = z.enum(['scheduled', 'confirmed', 'cancelled', 'completed', 'no-show']);

export const DoctorNameSchema = z
  .string()
  .min(2, 'Doctor name must be at least 2 characters')
  .max(200, 'Doctor name cannot exceed 200 characters')
  .regex(/^[a-zA-Z\s\-'.,]+$/, 'Doctor name contains invalid characters')
  .optional();

export const ContactNumberSchema = z
  .string()
  .regex(/^(\+639|639|09)\d{9}$/, 'Invalid Philippine mobile number format')
  .optional();

// Command schemas
export const CreateAppointmentCommandSchema = z.object({
  patientId: PatientIdSchema,
  patientName: PatientNameSchema,
  reasonForVisit: ReasonForVisitSchema,
  appointmentDate: AppointmentDateSchema,
  appointmentTime: AppointmentTimeSchema,
  doctorName: DoctorNameSchema,
  contactNumber: ContactNumberSchema,
}).refine((data) => {
  // Additional validation: ensure appointment is not too far in future (e.g., 1 year)
  const appointmentDate = new Date(data.appointmentDate);
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  return appointmentDate <= oneYearFromNow;
}, {
  message: 'Appointment cannot be scheduled more than 1 year in advance',
  path: ['appointmentDate']
});

export const UpdateAppointmentCommandSchema = z.object({
  id: AppointmentIdSchema,
  patientName: PatientNameSchema.optional(),
  reasonForVisit: ReasonForVisitSchema.optional(),
  appointmentDate: AppointmentDateSchema.optional(),
  appointmentTime: AppointmentTimeSchema.optional(),
  doctorName: DoctorNameSchema,
  contactNumber: ContactNumberSchema,
}).refine((data) => {
  // Ensure at least one field is being updated
  const { id, ...updates } = data;
  return Object.values(updates).some(value => value !== undefined);
}, {
  message: 'At least one field must be provided for update',
});

export const CancelAppointmentCommandSchema = z.object({
  id: AppointmentIdSchema,
  reason: z.string().max(500, 'Cancellation reason cannot exceed 500 characters').optional(),
});

export const ConfirmAppointmentCommandSchema = z.object({
  id: AppointmentIdSchema,
});

export const DeleteAppointmentCommandSchema = z.object({
  id: AppointmentIdSchema,
});

// Query schemas
export const GetAppointmentByIdQuerySchema = z.object({
  id: AppointmentIdSchema,
});

export const GetAppointmentsByPatientIdQuerySchema = z.object({
  patientId: PatientIdSchema,
});

export const GetWeeklyAppointmentSummaryQuerySchema = z.object({
  startDate: z.date().optional(),
});

// Infer TypeScript types from schemas
export type CreateAppointmentCommand = z.infer<typeof CreateAppointmentCommandSchema>;
export type UpdateAppointmentCommand = z.infer<typeof UpdateAppointmentCommandSchema>;
export type CancelAppointmentCommand = z.infer<typeof CancelAppointmentCommandSchema>;
export type ConfirmAppointmentCommand = z.infer<typeof ConfirmAppointmentCommandSchema>;
export type DeleteAppointmentCommand = z.infer<typeof DeleteAppointmentCommandSchema>;

export type GetAppointmentByIdQuery = z.infer<typeof GetAppointmentByIdQuerySchema>;
export type GetAppointmentsByPatientIdQuery = z.infer<typeof GetAppointmentsByPatientIdQuerySchema>;
export type GetWeeklyAppointmentSummaryQuery = z.infer<typeof GetWeeklyAppointmentSummaryQuerySchema>;

// Collection of all validation schemas
export const AppointmentValidationSchemas = {
  CreateAppointmentCommandSchema,
  UpdateAppointmentCommandSchema,
  CancelAppointmentCommandSchema,
  ConfirmAppointmentCommandSchema,
  DeleteAppointmentCommandSchema,
  GetAppointmentByIdQuerySchema,
  GetAppointmentsByPatientIdQuerySchema,
  GetWeeklyAppointmentSummaryQuerySchema,
  AppointmentIdSchema,
  PatientIdSchema,
  PatientNameSchema,
  ReasonForVisitSchema,
  AppointmentDateSchema,
  AppointmentTimeSchema,
  AppointmentStatusSchema,
  DoctorNameSchema,
  ContactNumberSchema,
};