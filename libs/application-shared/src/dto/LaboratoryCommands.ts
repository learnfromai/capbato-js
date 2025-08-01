// Command DTOs for Laboratory CQRS pattern
// TypeScript types are generated from Zod schemas for consistency

import {
  CreateLabRequestCommandSchema,
  UpdateLabRequestCommandSchema,
  DeleteLabRequestCommandSchema,
  CreateBloodChemistryCommandSchema,
} from '../validation/LaboratoryValidationSchemas';

// Re-export command types from validation schemas
export type {
  CreateLabRequestCommand,
  UpdateLabRequestCommand,
  DeleteLabRequestCommand,
  CreateBloodChemistryCommand,
} from '../validation/LaboratoryValidationSchemas';

// Re-export validation schemas for backward compatibility
export {
  CreateLabRequestCommandSchema,
  UpdateLabRequestCommandSchema,
  DeleteLabRequestCommandSchema,
  CreateBloodChemistryCommandSchema,
  LaboratoryValidationSchemas,
} from '../validation/LaboratoryValidationSchemas';

// Legacy function for backward compatibility - now returns required schemas
export const createLaboratoryCommandValidationSchema = () => {
  try {
    // Use proper ES6 imports since the module exists
    return {
      CreateLabRequestCommandSchema,
      UpdateLabRequestCommandSchema,
      DeleteLabRequestCommandSchema,
      CreateBloodChemistryCommandSchema,
    };
  } catch {
    // Fallback in case of import issues
    return {};
  }
};