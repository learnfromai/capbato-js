/**
 * Schedule Request DTOs
 * Data Transfer Objects for incoming API requests
 */

/**
 * Request DTO for creating a new schedule
 */
export interface CreateScheduleRequestDto {
  doctor: string; // Using 'doctor' to match legacy API
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // Time string in HH:MM format (24-hour)
}

/**
 * Request DTO for updating an existing schedule
 */
export interface UpdateScheduleRequestDto {
  doctor: string; // Using 'doctor' to match legacy API
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // Time string in HH:MM format (24-hour)
}

/**
 * Request DTO for rescheduling
 */
export interface RescheduleRequestDto {
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // Time string in HH:MM format (24-hour)
}

// Response type definitions
export interface ScheduleResponse {
  success: boolean;
  data: import('./ScheduleDto').ScheduleDto;
  message?: string;
}

export interface ScheduleListResponse {
  success: boolean;
  data: import('./ScheduleDto').ScheduleDto[];
  message?: string;
}

export interface ScheduleStatsResponse {
  success: boolean;
  data: import('./ScheduleDto').ScheduleStatsDto;
  message?: string;
}

export interface TodayDoctorResponse {
  success: boolean;
  data: import('./ScheduleDto').TodayDoctorDto;
  message?: string;
}

export interface ScheduleOperationResponse {
  success: boolean;
  message: string;
  data?: any;
}