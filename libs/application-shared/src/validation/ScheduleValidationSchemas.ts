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

  // Check maximum length (after trimming)
  if (doctorName.trim().length > 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Doctor name cannot exceed 100 characters',
    });
    return;
  }

  // Check for valid characters (letters, spaces, dots, hyphens)
  const validNameRegex = /^[a-zA-Z\s\.\-]+$/;
  if (!validNameRegex.test(doctorName.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Doctor name can only contain letters, spaces, dots, and hyphens',
    });
    return;
  }
};

export const ScheduleDoctorNameSchema = z
  .string()
  .transform((val) => val.trim())
  .superRefine(validateDoctorName);

// Date validation
const validateScheduleDate = (dateStr: string, ctx: z.RefinementCtx) => {
  const date = new Date(dateStr);
  
  if (isNaN(date.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid date format. Use YYYY-MM-DD',
    });
    return;
  }

  // Don't allow dates too far in the past (more than 1 year ago)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  if (date < oneYearAgo) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Date cannot be more than 1 year in the past',
    });
    return;
  }

  // Don't allow dates too far in the future (more than 2 years ahead)
  const twoYearsFromNow = new Date();
  twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
  
  if (date > twoYearsFromNow) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Date cannot be more than 2 years in the future',
    });
    return;
  }

  // Business rule: Cannot schedule in the past (except for today)
  const today = new Date();
  const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dateNormalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (dateNormalized.getTime() < todayNormalized.getTime()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Cannot schedule appointments in the past',
    });
    return;
  }
};

export const ScheduleDateSchema = z
  .string()
  .min(1, 'Date is required')
  .superRefine(validateScheduleDate);

// Time validation
const validateScheduleTime = (timeStr: string, ctx: z.RefinementCtx) => {
  // Support formats: HH:MM, H:MM, HH:M, H:M (24-hour format)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  
  if (!timeRegex.test(timeStr.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Time must be in HH:MM format (24-hour)',
    });
    return;
  }

  const [hourStr, minuteStr] = timeStr.trim().split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (hour < 0 || hour > 23) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Hour must be between 0 and 23',
    });
    return;
  }

  if (minute < 0 || minute > 59) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Minute must be between 0 and 59',
    });
    return;
  }

  // Business rule: Schedule times should be in working hours (6:00 AM to 10:00 PM)
  if (hour < 6 || hour > 22) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Schedule time must be between 6:00 AM and 10:00 PM',
    });
    return;
  }

  // Business rule: Schedule times should be in 15-minute intervals
  if (minute % 15 !== 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Schedule time must be in 15-minute intervals (00, 15, 30, 45)',
    });
    return;
  }
};

export const ScheduleTimeSchema = z
  .string()
  .min(1, 'Time is required')
  .transform((val) => val.trim())
  .superRefine(validateScheduleTime);

// Command validation schemas
export const CreateScheduleCommandSchema = z.object({
  doctorName: ScheduleDoctorNameSchema,
  date: ScheduleDateSchema,
  time: ScheduleTimeSchema,
});

export const UpdateScheduleCommandSchema = z.object({
  id: ScheduleIdSchema,
  doctorName: ScheduleDoctorNameSchema,
  date: ScheduleDateSchema,
  time: ScheduleTimeSchema,
});

export const DeleteScheduleCommandSchema = z.object({
  id: ScheduleIdSchema,
});

export const RescheduleCommandSchema = z.object({
  id: ScheduleIdSchema,
  date: ScheduleDateSchema,
  time: ScheduleTimeSchema,
});

// Request DTO validation schemas (for API endpoints)
export const CreateScheduleRequestSchema = z.object({
  doctor: ScheduleDoctorNameSchema,
  date: ScheduleDateSchema,
  time: ScheduleTimeSchema,
});

export const UpdateScheduleRequestSchema = z.object({
  doctor: ScheduleDoctorNameSchema,
  date: ScheduleDateSchema,
  time: ScheduleTimeSchema,
});

export const RescheduleRequestSchema = z.object({
  date: ScheduleDateSchema,
  time: ScheduleTimeSchema,
});

// Query validation schemas
export const GetScheduleByIdQuerySchema = z.object({
  id: ScheduleIdSchema,
});

export const GetSchedulesByDateQuerySchema = z.object({
  date: ScheduleDateSchema,
});

export const GetSchedulesByDoctorQuerySchema = z.object({
  doctorName: ScheduleDoctorNameSchema,
});

export const GetSchedulesByDateRangeQuerySchema = z.object({
  startDate: ScheduleDateSchema,
  endDate: ScheduleDateSchema,
}).refine((data) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return startDate <= endDate;
}, {
  message: 'Start date must be before or equal to end date',
  path: ['startDate'],
});

// Type exports
export type CreateScheduleCommandType = z.infer<typeof CreateScheduleCommandSchema>;
export type UpdateScheduleCommandType = z.infer<typeof UpdateScheduleCommandSchema>;
export type DeleteScheduleCommandType = z.infer<typeof DeleteScheduleCommandSchema>;
export type RescheduleCommandType = z.infer<typeof RescheduleCommandSchema>;
export type CreateScheduleRequestType = z.infer<typeof CreateScheduleRequestSchema>;
export type UpdateScheduleRequestType = z.infer<typeof UpdateScheduleRequestSchema>;
export type RescheduleRequestType = z.infer<typeof RescheduleRequestSchema>;