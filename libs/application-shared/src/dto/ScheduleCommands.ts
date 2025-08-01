// Command DTOs for CQRS pattern
// TypeScript types are now generated from Zod schemas for consistency

import {
  CreateScheduleCommandSchema,
  UpdateScheduleCommandSchema,
  DeleteScheduleCommandSchema,
  GetScheduleByIdCommandSchema,
} from '../validation/ScheduleValidationSchemas';

// Re-export command types from validation schemas
export type {
  CreateScheduleCommand,
  UpdateScheduleCommand,
  DeleteScheduleCommand,
  GetScheduleByIdCommand,
} from '../validation/ScheduleValidationSchemas';

// Re-export validation schemas for backward compatibility
export {
  CreateScheduleCommandSchema,
  UpdateScheduleCommandSchema,
  DeleteScheduleCommandSchema,
  GetScheduleByIdCommandSchema,
  ScheduleValidationSchemas,
} from '../validation/ScheduleValidationSchemas';

// Legacy function for backward compatibility - now returns required schemas
export const createScheduleCommandValidationSchema = () => {
  try {
    // Use proper ES6 imports since the module exists
    return {
      CreateScheduleCommandSchema,
      UpdateScheduleCommandSchema,
      DeleteScheduleCommandSchema,
      GetScheduleByIdCommandSchema,
    };
  } catch {
    // Fallback in case of import issues
    return {};
  }
};