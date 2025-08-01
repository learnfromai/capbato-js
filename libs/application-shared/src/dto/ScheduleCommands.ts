/**
 * Schedule Command DTOs
 * Data Transfer Objects for Schedule-related commands
 */

/**
 * Command to create a new schedule
 */
export interface CreateScheduleCommand {
  doctorName: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // Time string in HH:MM format (24-hour)
}

/**
 * Command to update an existing schedule
 */
export interface UpdateScheduleCommand {
  id: string;
  doctorName: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // Time string in HH:MM format (24-hour)
}

/**
 * Command to delete a schedule
 */
export interface DeleteScheduleCommand {
  id: string;
}

/**
 * Command to toggle/reschedule a schedule
 */
export interface RescheduleCommand {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // Time string in HH:MM format (24-hour)
}