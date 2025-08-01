/**
 * Schedule Query DTOs
 * Data Transfer Objects for Schedule-related queries
 */

/**
 * Query to get all schedules
 */
export interface GetAllSchedulesQuery {
  // No parameters needed
}

/**
 * Query to get schedule by ID  
 */
export interface GetScheduleByIdQuery {
  id: string;
}

/**
 * Query to get schedules by date
 */
export interface GetSchedulesByDateQuery {
  date: string; // ISO date string (YYYY-MM-DD)
}

/**
 * Query to get today's schedules
 */
export interface GetTodaySchedulesQuery {
  // No parameters needed - uses current date
}

/**
 * Query to get schedules by doctor name
 */
export interface GetSchedulesByDoctorQuery {
  doctorName: string;
}

/**
 * Query to get schedules by date range
 */
export interface GetSchedulesByDateRangeQuery {
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)
}

/**
 * Query to get schedule statistics
 */
export interface GetScheduleStatsQuery {
  // No parameters needed
}

/**
 * Query to get today's doctor (first doctor scheduled for today)
 */
export interface GetTodayDoctorQuery {
  // No parameters needed
}