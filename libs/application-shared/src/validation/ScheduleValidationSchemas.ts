import { z } from 'zod';

/**
 * Zod schemas for Schedule command validation
 * These schemas define the validation rules and generate TypeScript types
 */

// Enhanced doctor name validation with specific error messages
const validateDoctorName = (doctorName: string, ctx: z.RefinementCtx) => {
  // Check if doctor name is provided (not undefined/null)
  if (doctorName === undefined || doctorName === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Doctor name is required',
    });
    return;
  }

  // Check if doctor name is empty string
  if (doctorName === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Doctor name is required',
    });
    return;
  }

  // Check if doctor name becomes empty after trimming (whitespace only)
  if (doctorName.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Doctor name cannot be empty',
    });
    return;
  }

  // Check minimum length (after trimming)
  if (doctorName.trim().length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      message: 'Doctor name must be at least 2 characters',
      minimum: 2,
      origin: 'string',
      inclusive: true,
      input: doctorName,
    });
    return;
  }

  // Check maximum length (after trimming)
  if (doctorName.trim().length > 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      message: 'Doctor name cannot exceed 100 characters',
      maximum: 100,
      origin: 'string',
      inclusive: true,
      input: doctorName,
    });
    return;
  }

  // Check for valid characters
  const namePattern = /^[a-zA-Z\s\.\-']+$/;
  if (!namePattern.test(doctorName.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Doctor name can only contain letters, spaces, periods, hyphens, and apostrophes',
    });
    return;
  }

  // Check for starting/ending with special characters
  const trimmed = doctorName.trim();
  if (trimmed.startsWith('.') || trimmed.startsWith('-') || 
      trimmed.endsWith('.') || trimmed.endsWith('-')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Doctor name cannot start or end with periods or hyphens',
    });
    return;
  }
};

// Enhanced date validation
const validateScheduleDate = (date: string, ctx: z.RefinementCtx) => {
  // Check if date is provided
  if (!date || date.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Date is required',
    });
    return;
  }

  // Parse the date
  const parsedDate = new Date(date);
  
  // Check if date is valid
  if (isNaN(parsedDate.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Date must be a valid date',
    });
    return;
  }

  // Check if date is not in the past (but allow today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const inputDate = new Date(parsedDate);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate < today) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Date cannot be in the past',
    });
    return;
  }

  // Check if date is not more than 2 years in the future
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);
  maxDate.setHours(0, 0, 0, 0);

  if (inputDate > maxDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Date cannot be more than 2 years in the future',
    });
    return;
  }
};

// Enhanced time validation
const validateScheduleTime = (time: string, ctx: z.RefinementCtx) => {
  // Check if time is provided
  if (!time || time.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Time is required',
    });
    return;
  }

  // Check time format (HH:MM)
  const timePattern = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
  if (!timePattern.test(time.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Time must be in HH:MM format (24-hour)',
    });
    return;
  }

  // Parse hours and minutes
  const [hoursStr, minutesStr] = time.trim().split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  // Check business hours (8 AM to 6 PM)
  if (hours < 8 || hours >= 18) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Time must be during business hours (08:00 - 17:59)',
    });
    return;
  }

  // Check 15-minute intervals
  if (minutes % 15 !== 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Time must be in 15-minute intervals (00, 15, 30, 45)',
    });
    return;
  }
};

// Base validation schemas
export const ScheduleDoctorNameSchema = z.string().superRefine(validateDoctorName);
export const ScheduleDateSchema = z.string().superRefine(validateScheduleDate);
export const ScheduleTimeSchema = z.string().superRefine(validateScheduleTime);

// ID validation schema (reusable)
export const ScheduleIdSchema = z.string()
  .min(1, 'Schedule ID is required')
  .refine(
    (id) => {
      // Support both UUID and MongoDB ObjectId formats
      const uuidRegex = /^[0-9a-f]{32}$/i;
      const mongoIdRegex = /^[0-9a-f]{24}$/i;
      return uuidRegex.test(id) || mongoIdRegex.test(id);
    },
    {
      message: 'Schedule ID must be a valid UUID or MongoDB ObjectId',
    }
  );

/**
 * Command schemas for Schedule operations
 */

// Create Schedule Command Schema
export const CreateScheduleCommandSchema = z.object({
  doctorName: ScheduleDoctorNameSchema,
  date: ScheduleDateSchema,
  time: ScheduleTimeSchema,
});

// Update Schedule Command Schema
export const UpdateScheduleCommandSchema = z.object({
  id: ScheduleIdSchema,
  doctorName: ScheduleDoctorNameSchema.optional(),
  date: ScheduleDateSchema.optional(),
  time: ScheduleTimeSchema.optional(),
}).refine(
  (data) => {
    // At least one field must be provided for update
    return data.doctorName !== undefined || data.date !== undefined || data.time !== undefined;
  },
  {
    message: 'At least one field (doctorName, date, or time) must be provided for update',
  }
);

// Delete Schedule Command Schema
export const DeleteScheduleCommandSchema = z.object({
  id: ScheduleIdSchema,
});

// Get Schedule By ID Command Schema
export const GetScheduleByIdCommandSchema = z.object({
  id: ScheduleIdSchema,
});

/**
 * TypeScript types generated from schemas
 */
export type CreateScheduleCommand = z.infer<typeof CreateScheduleCommandSchema>;
export type UpdateScheduleCommand = z.infer<typeof UpdateScheduleCommandSchema>;
export type DeleteScheduleCommand = z.infer<typeof DeleteScheduleCommandSchema>;
export type GetScheduleByIdCommand = z.infer<typeof GetScheduleByIdCommandSchema>;

/**
 * Collection of all validation schemas for easy import
 */
export const ScheduleValidationSchemas = {
  CreateScheduleCommandSchema,
  UpdateScheduleCommandSchema,
  DeleteScheduleCommandSchema,
  GetScheduleByIdCommandSchema,
  ScheduleIdSchema,
  ScheduleDoctorNameSchema,
  ScheduleDateSchema,
  ScheduleTimeSchema,
} as const;