// Data Transfer Objects for Schedule operations
// Unified version for both frontend and backend

export interface ScheduleDto {
  id: string;
  doctorName: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // Time string in HH:MM format (24-hour)
  timeFormatted12Hour: string; // Time string in 12-hour format with AM/PM
  createdAt: string; // ISO datetime string
  updatedAt?: string; // ISO datetime string
}

export interface CreateScheduleDto {
  doctorName: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // Time string in HH:MM format (24-hour)
}

export interface UpdateScheduleDto {
  doctorName?: string;
  date?: string; // ISO date string (YYYY-MM-DD)
  time?: string; // Time string in HH:MM format (24-hour)
}

export interface TodaysDoctorDto {
  doctorName: string;
}

export interface ScheduleFilterDto {
  doctorName?: string;
  date?: string; // ISO date string (YYYY-MM-DD)
  startDate?: string; // ISO date string (YYYY-MM-DD)
  endDate?: string; // ISO date string (YYYY-MM-DD)
}