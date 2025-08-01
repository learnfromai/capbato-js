/**
 * Data Transfer Objects for Appointment API responses
 */

/**
 * Appointment DTO for API responses
 */
export interface AppointmentDto {
  id: string;
  patientId: string;
  patientName: string;
  reasonForVisit: string;
  appointmentDate: string; // ISO date string
  appointmentTime: string; // HH:MM format
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  doctorName?: string;
  contactNumber?: string;
  notes?: string;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
}

/**
 * Request DTOs for API endpoints
 */
export interface CreateAppointmentRequestDto {
  patientId: string;
  patientName: string;
  reasonForVisit: string;
  appointmentDate: string; // YYYY-MM-DD format
  appointmentTime: string; // HH:MM format
  doctorName?: string;
  contactNumber?: string;
  notes?: string;
}

export interface UpdateAppointmentRequestDto {
  patientId?: string;
  patientName?: string;
  reasonForVisit?: string;
  appointmentDate?: string; // YYYY-MM-DD format
  appointmentTime?: string; // HH:MM format
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  doctorName?: string;
  contactNumber?: string;
  notes?: string;
}

export interface RescheduleAppointmentRequestDto {
  appointmentDate: string; // YYYY-MM-DD format
  appointmentTime: string; // HH:MM format
}

export interface SearchAppointmentsRequestDto {
  patientName?: string;
  doctorName?: string;
  status?: string;
  dateFrom?: string; // YYYY-MM-DD format
  dateTo?: string; // YYYY-MM-DD format
}

/**
 * Response DTOs for specific API responses
 */
export interface AppointmentResponse {
  success: boolean;
  data: AppointmentDto;
  message?: string;
}

export interface AppointmentListResponse {
  success: boolean;
  data: AppointmentDto[];
  message?: string;
}

export interface AppointmentOperationResponse {
  success: boolean;
  message: string;
}

export interface AppointmentStatsResponse {
  success: boolean;
  data: {
    total: number;
    scheduled: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    overdue: number;
    today: number;
    thisWeek: number;
  };
  message?: string;
}

export interface WeeklyAppointmentSummaryResponse {
  success: boolean;
  data: Array<{
    date: string;
    count: number;
  }>;
  message?: string;
}

export interface TimeSlotAvailabilityResponse {
  success: boolean;
  data: {
    available: boolean;
    currentCount: number;
    maxCount: number;
  };
  message?: string;
}

export interface AvailableTimeSlotsResponse {
  success: boolean;
  data: string[];
  message?: string;
}

export interface TodayConfirmedAppointmentsCountResponse {
  success: boolean;
  data: {
    total: number;
  };
  message?: string;
}