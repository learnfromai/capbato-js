import type { ApiResponse } from './ApiResponse';
import type { 
  LabRequestDto, 
  BloodChemistryDto, 
  LaboratoryStatsDto,
  CreateLabRequestRequestDto,
  UpdateLabRequestRequestDto,
  CreateBloodChemistryRequestDto
} from './LaboratoryDto';

/**
 * Laboratory API Response Types
 * These types define the structure of API responses for laboratory operations
 */

// Single lab request response
export type LabRequestResponse = ApiResponse<LabRequestDto>;

// Multiple lab requests response
export type LabRequestListResponse = ApiResponse<LabRequestDto[]>;

// Single blood chemistry response
export type BloodChemistryResponse = ApiResponse<BloodChemistryDto>;

// Multiple blood chemistries response
export type BloodChemistryListResponse = ApiResponse<BloodChemistryDto[]>;

// Laboratory statistics response
export type LaboratoryStatsResponse = ApiResponse<LaboratoryStatsDto>;

// Operation confirmation responses
export type LabRequestOperationResponse = ApiResponse<{ message: string }>;
export type BloodChemistryOperationResponse = ApiResponse<{ message: string }>;

// Re-export request DTOs for convenience
export type {
  CreateLabRequestRequestDto,
  UpdateLabRequestRequestDto,
  CreateBloodChemistryRequestDto,
  LabRequestDto,
  BloodChemistryDto,
  LaboratoryStatsDto,
};