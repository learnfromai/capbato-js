// Command DTOs for CQRS pattern
// TypeScript types are now generated from Zod schemas for consistency

import {
  CreateAppointmentCommandSchema,
  UpdateAppointmentCommandSchema,
  ConfirmAppointmentCommandSchema,
  CancelAppointmentCommandSchema,
  CompleteAppointmentCommandSchema,
  RescheduleAppointmentCommandSchema,
  AppointmentIdSchema,
} from '../validation/AppointmentValidationSchemas';

// Re-export command types from validation schemas
export type {
  CreateAppointmentCommand,
  UpdateAppointmentCommand,
  ConfirmAppointmentCommand,
  CancelAppointmentCommand,
  CompleteAppointmentCommand,
  RescheduleAppointmentCommand,
} from '../validation/AppointmentValidationSchemas';

// Re-export validation schemas for backward compatibility
export {
  CreateAppointmentCommandSchema,
  UpdateAppointmentCommandSchema,
  ConfirmAppointmentCommandSchema,
  CancelAppointmentCommandSchema,
  CompleteAppointmentCommandSchema,
  RescheduleAppointmentCommandSchema,
  AppointmentValidationSchemas,
  AppointmentIdSchema,
} from '../validation/AppointmentValidationSchemas';

// Legacy function for backward compatibility - now returns required schemas
export const createAppointmentCommandValidationSchema = () => {
  try {
    return {
      CreateAppointmentCommandSchema,
      UpdateAppointmentCommandSchema,
      ConfirmAppointmentCommandSchema,
      CancelAppointmentCommandSchema,
      CompleteAppointmentCommandSchema,
      RescheduleAppointmentCommandSchema,
      AppointmentIdSchema,
    };
  } catch {
    // Fallback in case of import issues
    return {};
  }
};