// Query DTOs for CQRS pattern
// TypeScript types are now generated from Zod schemas for consistency

import {
  GetAppointmentByIdQuerySchema,
  GetAppointmentsByPatientIdQuerySchema,
  GetAppointmentsByDateQuerySchema,
  GetAppointmentsByDateRangeQuerySchema,
} from '../validation/AppointmentValidationSchemas';

// Re-export query types from validation schemas
export type {
  GetAppointmentByIdQuery,
  GetAppointmentsByPatientIdQuery,
  GetAppointmentsByDateQuery,
  GetAppointmentsByDateRangeQuery,
} from '../validation/AppointmentValidationSchemas';

// Re-export validation schemas for backward compatibility
export {
  GetAppointmentByIdQuerySchema,
  GetAppointmentsByPatientIdQuerySchema,
  GetAppointmentsByDateQuerySchema,
  GetAppointmentsByDateRangeQuerySchema,
} from '../validation/AppointmentValidationSchemas';

// Request DTOs for API endpoints
export interface CreateAppointmentRequestDto {
  patientId: string;
  reasonForVisit: string;
  appointmentDate: string; // ISO date string
  appointmentTime: string; // HH:MM format
  status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  doctorId: string;
}

export interface UpdateAppointmentRequestDto {
  patientId?: string;
  reasonForVisit?: string;
  appointmentDate?: string; // ISO date string
  appointmentTime?: string; // HH:MM format
  status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  doctorId?: string;
}

export interface RescheduleAppointmentRequestDto {
  appointmentDate: string; // ISO date string
  appointmentTime: string; // HH:MM format
}

// Response DTOs
export interface AppointmentDto {
  id: string;
  patientId: string;
  reasonForVisit: string;
  appointmentDate: string; // ISO date string
  appointmentTime: string; // HH:MM format
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  doctorId: string;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface AppointmentStatsDto {
  total: number;
  confirmed: number;
  scheduled: number;
  cancelled: number;
  completed: number;
  todayTotal: number;
  todayConfirmed: number;
}

export interface WeeklyAppointmentSummaryDto {
  date: string; // YYYY-MM-DD format
  count: number;
}

// API Response types (following TodoController pattern from ApiResponse.ts)
export interface AppointmentResponse {
  success: true;
  data: AppointmentDto;
}

export interface AppointmentListResponse {
  success: true;
  data: AppointmentDto[];
}

export interface AppointmentStatsResponse {
  success: true;
  data: AppointmentStatsDto;
}

export interface AppointmentOperationResponse {
  success: true;
  message: string;
}

export interface WeeklyAppointmentSummaryResponse {
  success: true;
  data: WeeklyAppointmentSummaryDto[];
}
