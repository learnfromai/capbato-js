// Command DTOs for CQRS pattern - Laboratory
// TypeScript types are generated from Zod schemas for consistency

import {
  CreateLabRequestCommandSchema,
  UpdateLabRequestResultsCommandSchema,
  GetLabRequestByPatientIdCommandSchema,
  DeleteLabRequestCommandSchema,
  CreateBloodChemistryCommandSchema,
  DeleteBloodChemistryCommandSchema,
} from '../validation/LaboratoryValidationSchemas';

// Re-export command types from validation schemas
export type {
  CreateLabRequestCommand,
  UpdateLabRequestResultsCommand,
  GetLabRequestByPatientIdCommand,
  DeleteLabRequestCommand,
  CreateBloodChemistryCommand,
  DeleteBloodChemistryCommand,
} from '../validation/LaboratoryValidationSchemas';

// Re-export validation schemas for backward compatibility
export {
  CreateLabRequestCommandSchema,
  UpdateLabRequestResultsCommandSchema,
  GetLabRequestByPatientIdCommandSchema,
  DeleteLabRequestCommandSchema,
  CreateBloodChemistryCommandSchema,
  DeleteBloodChemistryCommandSchema,
  LaboratoryValidationSchemas,
} from '../validation/LaboratoryValidationSchemas';

// Legacy function for backward compatibility - now returns required schemas
export const createLaboratoryCommandValidationSchema = () => {
  try {
    // Use proper ES6 imports since the module exists
    return {
      CreateLabRequestCommandSchema,
      UpdateLabRequestResultsCommandSchema,
      GetLabRequestByPatientIdCommandSchema,
      DeleteLabRequestCommandSchema,
      CreateBloodChemistryCommandSchema,
      DeleteBloodChemistryCommandSchema,
    };
  } catch {
    // Fallback in case of import issues
    return {};
  }
};