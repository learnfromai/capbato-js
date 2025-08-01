// Query DTOs for CQRS pattern

/**
 * Query for getting appointment by ID
 */
export interface GetAppointmentByIdQuery {
  id: string;
}

/**
 * Query for getting appointments by patient ID
 */
export interface GetAppointmentsByPatientIdQuery {
  patientId: string;
}

/**
 * Query for getting appointments by date
 */
export interface GetAppointmentsByDateQuery {
  date: Date;
}

/**
 * Query for getting appointments by date range
 */
export interface GetAppointmentsByDateRangeQuery {
  startDate: Date;
  endDate: Date;
}

/**
 * Query for getting appointments by status
 */
export interface GetAppointmentsByStatusQuery {
  status: string;
}

/**
 * Query for getting today's appointments
 */
export interface GetTodayAppointmentsQuery {
  // No parameters needed - uses current date
}

/**
 * Query for getting today's confirmed appointments count
 */
export interface GetTodayConfirmedAppointmentsCountQuery {
  // No parameters needed - uses current date
}

/**
 * Query for getting weekly appointment summary
 */
export interface GetWeeklyAppointmentSummaryQuery {
  startDate?: Date; // Optional - defaults to week starting from today
}

/**
 * Query for getting all appointments
 */
export interface GetAllAppointmentsQuery {
  // No parameters needed
}

/**
 * Query for checking time slot availability
 */
export interface CheckTimeSlotAvailabilityQuery {
  date: Date;
  time: string;
  maxAppointments?: number; // Optional - defaults to 4
}

/**
 * Query for getting available time slots
 */
export interface GetAvailableTimeSlotsQuery {
  date: Date;
  maxAppointments?: number; // Optional - defaults to 4
}

/**
 * Query for getting appointment statistics
 */
export interface GetAppointmentStatsQuery {
  // No parameters needed
}

/**
 * Query for searching appointments
 */
export interface SearchAppointmentsQuery {
  patientName?: string;
  doctorName?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * Query for getting upcoming appointments
 */
export interface GetUpcomingAppointmentsQuery {
  days?: number; // Optional - defaults to 7 days
}

/**
 * Query for getting overdue appointments
 */
export interface GetOverdueAppointmentsQuery {
  // No parameters needed
}

/**
 * Result types for query responses
 */

/**
 * Weekly appointment summary result
 */
export interface WeeklyAppointmentSummaryResult {
  date: string;
  count: number;
}

/**
 * Time slot availability result
 */
export interface TimeSlotAvailabilityResult {
  available: boolean;
  currentCount: number;
  maxCount: number;
}

/**
 * Available time slots result
 */
export interface AvailableTimeSlotsResult {
  slots: string[];
}

/**
 * Appointment statistics result
 */
export interface AppointmentStatsResult {
  total: number;
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  overdue: number;
  today: number;
  thisWeek: number;
}