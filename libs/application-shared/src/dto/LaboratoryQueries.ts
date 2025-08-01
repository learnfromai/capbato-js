// Laboratory Query DTOs and types

export interface GetAllLabRequestsQuery {
  // No parameters needed for getting all lab requests
}

export interface GetLabRequestByIdQuery {
  id: string;
}

export interface GetLabRequestByPatientIdQuery {
  patientId: string;
}

export interface GetCompletedLabRequestsQuery {
  // No parameters needed - gets all completed lab requests
}

export interface GetLabRequestStatsQuery {
  // No parameters needed for basic stats
}

export interface GetAllBloodChemistryQuery {
  // No parameters needed for getting all blood chemistry results
}

export interface GetBloodChemistryByIdQuery {
  id: string;
}

export interface GetBloodChemistryByPatientNameQuery {
  patientName: string;
}

export interface GetBloodChemistryByDateRangeQuery {
  startDate: Date;
  endDate: Date;
}

export interface GetBloodChemistryStatsQuery {
  // No parameters needed for basic stats
}

// Response type unions for better type safety
export type LabRequestQueryResponse = 
  | GetAllLabRequestsQuery
  | GetLabRequestByIdQuery
  | GetLabRequestByPatientIdQuery
  | GetCompletedLabRequestsQuery
  | GetLabRequestStatsQuery;

export type BloodChemistryQueryResponse = 
  | GetAllBloodChemistryQuery
  | GetBloodChemistryByIdQuery
  | GetBloodChemistryByPatientNameQuery
  | GetBloodChemistryByDateRangeQuery
  | GetBloodChemistryStatsQuery;