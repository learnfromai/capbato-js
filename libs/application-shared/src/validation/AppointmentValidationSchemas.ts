import { z } from 'zod';
import type { AppointmentStatusType } from '@nx-starter/domain';

/**
 * Zod schemas for Appointment command validation
 * These schemas define the validation rules and generate TypeScript types
 */

// Base appointment validation schemas
export const AppointmentStatusSchema = z.enum(['scheduled', 'confirmed', 'completed', 'cancelled']);

// Enhanced validation functions
const validatePatientId = (patientId: string, ctx: z.RefinementCtx) => {
  if (!patientId || patientId.trim().length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Patient ID is required',
    });
    return;
  }
};

const validatePatientName = (name: string, ctx: z.RefinementCtx) => {
  if (!name || name.trim().length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Patient name is required',
    });
    return;
  }

  if (name.trim().length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      message: 'Patient name must be at least 2 characters',
      minimum: 2,
      type: 'string',
      inclusive: true,
    });
    return;
  }

  if (name.length > 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Patient name cannot exceed 100 characters',
    });
    return;
  }
};

const validateReasonForVisit = (reason: string, ctx: z.RefinementCtx) => {
  if (!reason || reason.trim().length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Reason for visit is required',
    });
    return;
  }

  if (reason.trim().length < 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      message: 'Reason for visit must be at least 3 characters',
      minimum: 3,
      type: 'string',
      inclusive: true,
    });
    return;
  }

  if (reason.length > 500) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Reason for visit cannot exceed 500 characters',
    });
    return;
  }
};

const validateAppointmentTime = (time: string, ctx: z.RefinementCtx) => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  
  if (!timeRegex.test(time)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid time format. Use HH:MM format (24-hour)',
    });
    return;
  }

  const [hours, minutes] = time.split(':').map(Number);
  
  // Business hours validation
  if (hours < 8 || hours >= 17) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Appointment time must be between 8:00 and 17:00',
    });
    return;
  }

  // 30-minute intervals validation
  if (minutes % 30 !== 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Appointment time must be in 30-minute intervals (e.g., 09:00, 09:30)',
    });
    return;
  }
};

const validateAppointmentDate = (dateStr: string, ctx: z.RefinementCtx) => {
  const date = new Date(dateStr);
  
  if (isNaN(date.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid date format',
    });
    return;
  }

  // Check if date is not in the past
  const today = new Date();
  const appointmentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (appointmentDate < todayDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Cannot book appointment for a past date',
    });
    return;
  }

  // Check if date is not too far in the future (1 year)
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  
  if (appointmentDate > oneYearFromNow) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Cannot book appointment more than one year in advance',
    });
    return;
  }
};

// Create appointment command schema
export const CreateAppointmentCommandSchema = z.object({
  patientId: z.string().superRefine(validatePatientId),
  patientName: z.string().superRefine(validatePatientName),
  reasonForVisit: z.string().superRefine(validateReasonForVisit),
  appointmentDate: z.string().superRefine(validateAppointmentDate),
  appointmentTime: z.string().superRefine(validateAppointmentTime),
  doctorName: z.string().optional(),
  contactNumber: z.string().optional(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
}).transform((data) => ({
  ...data,
  appointmentDate: new Date(data.appointmentDate),
}));

// Update appointment command schema
export const UpdateAppointmentCommandSchema = z.object({
  id: z.string().min(1, 'Appointment ID is required'),
  patientId: z.string().superRefine(validatePatientId).optional(),
  patientName: z.string().superRefine(validatePatientName).optional(),
  reasonForVisit: z.string().superRefine(validateReasonForVisit).optional(),
  appointmentDate: z.string().superRefine(validateAppointmentDate).optional(),
  appointmentTime: z.string().superRefine(validateAppointmentTime).optional(),
  status: AppointmentStatusSchema.optional(),
  doctorName: z.string().optional(),
  contactNumber: z.string().optional(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
}).transform((data) => ({
  ...data,
  appointmentDate: data.appointmentDate ? new Date(data.appointmentDate) : undefined,
}));

// Confirm appointment command schema
export const ConfirmAppointmentCommandSchema = z.object({
  id: z.string().min(1, 'Appointment ID is required'),
});

// Cancel appointment command schema
export const CancelAppointmentCommandSchema = z.object({
  id: z.string().min(1, 'Appointment ID is required'),
});

// Complete appointment command schema
export const CompleteAppointmentCommandSchema = z.object({
  id: z.string().min(1, 'Appointment ID is required'),
});

// Reschedule appointment command schema
export const RescheduleAppointmentCommandSchema = z.object({
  id: z.string().min(1, 'Appointment ID is required'),
  appointmentDate: z.string().superRefine(validateAppointmentDate),
  appointmentTime: z.string().superRefine(validateAppointmentTime),
}).transform((data) => ({
  ...data,
  appointmentDate: new Date(data.appointmentDate),
}));

// Simple ID validation schema for route parameters
export const AppointmentIdSchema = z.string().min(1, 'Appointment ID is required');

// Inferred TypeScript types from Zod schemas
export type CreateAppointmentCommand = z.infer<typeof CreateAppointmentCommandSchema>;
export type UpdateAppointmentCommand = z.infer<typeof UpdateAppointmentCommandSchema>;
export type ConfirmAppointmentCommand = z.infer<typeof ConfirmAppointmentCommandSchema>;
export type CancelAppointmentCommand = z.infer<typeof CancelAppointmentCommandSchema>;
export type CompleteAppointmentCommand = z.infer<typeof CompleteAppointmentCommandSchema>;
export type RescheduleAppointmentCommand = z.infer<typeof RescheduleAppointmentCommandSchema>;

// Export all schemas as a collection for easier importing
export const AppointmentValidationSchemas = {
  CreateAppointmentCommandSchema,
  UpdateAppointmentCommandSchema,
  ConfirmAppointmentCommandSchema,
  CancelAppointmentCommandSchema,
  CompleteAppointmentCommandSchema,
  RescheduleAppointmentCommandSchema,
  AppointmentIdSchema,
} as const;