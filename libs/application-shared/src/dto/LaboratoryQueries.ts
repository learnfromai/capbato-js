// Query DTOs for Laboratory CQRS pattern
// TypeScript types are generated from Zod schemas for consistency

import {
  GetLabRequestByPatientIdSchema,
  GetLabRequestByIdSchema,
} from '../validation/LaboratoryValidationSchemas';

// Re-export query types from validation schemas
export type {
  GetLabRequestByPatientIdQuery,
  GetLabRequestByIdQuery,
} from '../validation/LaboratoryValidationSchemas';

// Re-export validation schemas
export {
  GetLabRequestByPatientIdSchema,
  GetLabRequestByIdSchema,
  LabRequestIdSchema,
} from '../validation/LaboratoryValidationSchemas';

// Basic query interfaces for laboratory operations
export interface GetAllLabRequestsQuery {
  // No parameters needed for getting all lab requests
}

export interface GetCompletedLabRequestsQuery {
  // No parameters needed for getting completed lab requests
}

export interface GetLabRequestsByStatusQuery {
  status: 'Pending' | 'In Progress' | 'Complete' | 'Cancelled';
}

export interface GetAllBloodChemistriesQuery {
  // No parameters needed for getting all blood chemistries
}

export interface GetBloodChemistriesByPatientNameQuery {
  patientName: string;
}

export interface GetBloodChemistriesByDateRangeQuery {
  startDate: Date;
  endDate: Date;
}