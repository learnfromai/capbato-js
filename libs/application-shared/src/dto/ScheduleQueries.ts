// Query DTOs for CQRS pattern
// Unified version for Schedule queries

/**
 * Query for getting all schedules
 */
export type GetAllSchedulesQuery = object;

/**
 * Query for getting schedules by doctor name
 */
export interface GetSchedulesByDoctorQuery {
  doctorName: string;
}

/**
 * Query for getting schedules by date
 */
export interface GetSchedulesByDateQuery {
  date: string; // ISO date string (YYYY-MM-DD)
}

/**
 * Query for getting schedules in a date range
 */
export interface GetSchedulesByDateRangeQuery {
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)
}

/**
 * Query for getting today's schedules
 */
export type GetTodaysSchedulesQuery = object;

/**
 * Query for getting today's doctor (first scheduled doctor for today)
 */
export type GetTodaysDoctorQuery = object;

/**
 * Query for getting a single schedule by ID
 */
export interface GetScheduleByIdQuery {
  id: string;
}

/**
 * Query for getting upcoming schedules
 */
export type GetUpcomingSchedulesQuery = object;

/**
 * Query response for today's doctor
 */
export interface TodaysDoctorQueryResult {
  doctorName: string | null;
}