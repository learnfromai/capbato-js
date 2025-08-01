/**
 * Schedule Data Transfer Object
 * Represents a schedule for API responses
 */
export interface ScheduleDto {
  id?: string;
  doctorName: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // Time in HH:MM format (24-hour)
  timeDisplay: string; // Time in 12-hour format with AM/PM
  createdAt: string; // ISO date string
  displayString: string; // Human-readable display string
  isToday: boolean;
  isFuture: boolean;
  isPast: boolean;
}

/**
 * Schedule statistics DTO
 */
export interface ScheduleStatsDto {
  total: number;
  today: number;
  upcoming: number;
  past: number;
  uniqueDoctors: number;
  averageSchedulesPerDay: number;
}

/**
 * Today's doctor DTO
 */
export interface TodayDoctorDto {
  doctorName: string;
  hasSchedule: boolean;
  scheduleTime?: string;
  scheduleTimeDisplay?: string;
}