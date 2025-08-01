/**
 * Request DTOs for Schedule API endpoints
 * These define the shape of HTTP request bodies for type safety
 * Shared between frontend and backend for consistent API contracts
 * Validation is still handled by Zod schemas in the application layer
 */

/**
 * Request body for creating a new schedule
 * POST /api/schedules
 */
export interface CreateScheduleRequestDto {
  doctorName: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // Time string in HH:MM format (24-hour)
}

/**
 * Request body for updating an existing schedule
 * PUT /api/schedules/:id
 * Note: id comes from route parameter, not request body
 */
export interface UpdateScheduleRequestDto {
  doctorName?: string;
  date?: string; // ISO date string (YYYY-MM-DD)
  time?: string; // Time string in HH:MM format (24-hour)
}