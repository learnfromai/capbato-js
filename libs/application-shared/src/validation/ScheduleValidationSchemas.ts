import { z } from 'zod';

/**
 * Zod schemas for Schedule command validation
 * These schemas define the validation rules and generate TypeScript types
 */

// Base Schedule validation schemas
export const ScheduleIdSchema = z.string().min(1, 'Schedule ID is required');

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
      code: z.ZodIssueCode.custom,
      message: 'Doctor name must be at least 2 characters',
    });
    return;
  }

  // Check maximum length
  if (doctorName.trim().length > 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Doctor name cannot exceed 100 characters',
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
      message: 'Schedule date is required',
    });
    return;
  }

  // Check if it's a valid date format
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid date format. Use YYYY-MM-DD or ISO date string',
    });
    return;
  }

  // Check if date is not in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const scheduleDate = new Date(date);
  scheduleDate.setHours(0, 0, 0, 0);

  if (scheduleDate < today) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Schedule date cannot be in the past',
    });
    return;
  }

  // Check if date is not too far in the future (2 years)
  const maxFutureDate = new Date();
  maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 2);

  if (parsedDate > maxFutureDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Schedule date cannot be more than 2 years in the future',
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
      message: 'Schedule time is required',
    });
    return;
  }

  // Check time format (HH:MM or HH:MM AM/PM)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(\s?(AM|PM|am|pm))?$/;
  
  if (!timeRegex.test(time.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid time format. Use HH:MM (24-hour) or HH:MM AM/PM format',
    });
    return;
  }

  // Normalize time to 24-hour format for validation
  let normalizedTime = time.trim();
  if (normalizedTime.toLowerCase().includes('am') || normalizedTime.toLowerCase().includes('pm')) {
    const [timePart, period] = normalizedTime.split(/\s+/);
    const [hours, minutes] = timePart.split(':').map(Number);
    
    let normalizedHours = hours;
    if (period.toLowerCase() === 'pm' && hours !== 12) {
      normalizedHours += 12;
    } else if (period.toLowerCase() === 'am' && hours === 12) {
      normalizedHours = 0;
    }
    
    normalizedTime = `${normalizedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  const [hours, minutes] = normalizedTime.split(':').map(Number);

  // Check working hours (6 AM to 10 PM)
  if (hours < 6 || hours > 22) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Schedule time must be between 6:00 AM and 10:00 PM',
    });
    return;
  }

  // Check 15-minute intervals
  if (minutes % 15 !== 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Schedule time must be on 15-minute intervals (00, 15, 30, 45)',
    });
    return;
  }
};

// Base schemas with enhanced validation
export const DoctorNameSchema = z.string().superRefine(validateDoctorName);
export const ScheduleDateSchema = z.string().superRefine(validateScheduleDate);
export const ScheduleTimeSchema = z.string().superRefine(validateScheduleTime);

// Command schemas
export const CreateScheduleCommandSchema = z.object({
  doctorName: DoctorNameSchema,
  date: ScheduleDateSchema,
  time: ScheduleTimeSchema,
});

export const UpdateScheduleCommandSchema = z.object({
  id: ScheduleIdSchema,
  doctorName: DoctorNameSchema.optional(),
  date: ScheduleDateSchema.optional(),
  time: ScheduleTimeSchema.optional(),
});

export const DeleteScheduleCommandSchema = z.object({
  id: ScheduleIdSchema,
});

export const GetScheduleByIdQuerySchema = z.object({
  id: ScheduleIdSchema,
});

export const GetSchedulesByDateQuerySchema = z.object({
  date: ScheduleDateSchema,
});

export const GetSchedulesByDoctorQuerySchema = z.object({
  doctorName: DoctorNameSchema,
});

// Type inference from schemas
export type CreateScheduleCommand = z.infer<typeof CreateScheduleCommandSchema>;
export type UpdateScheduleCommand = z.infer<typeof UpdateScheduleCommandSchema>;
export type DeleteScheduleCommand = z.infer<typeof DeleteScheduleCommandSchema>;
export type GetScheduleByIdQuery = z.infer<typeof GetScheduleByIdQuerySchema>;
export type GetSchedulesByDateQuery = z.infer<typeof GetSchedulesByDateQuerySchema>;
export type GetSchedulesByDoctorQuery = z.infer<typeof GetSchedulesByDoctorQuerySchema>;

// Consolidated validation schemas object
export const ScheduleValidationSchemas = {
  CreateScheduleCommandSchema,
  UpdateScheduleCommandSchema,
  DeleteScheduleCommandSchema,
  GetScheduleByIdQuerySchema,
  GetSchedulesByDateQuerySchema,
  GetSchedulesByDoctorQuerySchema,
  ScheduleIdSchema,
  DoctorNameSchema,
  ScheduleDateSchema,
  ScheduleTimeSchema,
} as const;

// Helper function for custom validation errors
export const createScheduleValidationError = (
  message: string,
  path: string[]
) => ({
  code: 'custom' as const,
  message,
  path,
});

// Safe validation functions (non-throwing)
export const safeValidateCreateScheduleCommand = (data: unknown) => {
  return CreateScheduleCommandSchema.safeParse(data);
};

export const safeValidateUpdateScheduleCommand = (data: unknown) => {
  return UpdateScheduleCommandSchema.safeParse(data);
};

export const safeValidateDeleteScheduleCommand = (data: unknown) => {
  return DeleteScheduleCommandSchema.safeParse(data);
};