// Request DTOs for API endpoints

export interface CreateAppointmentRequestDto {
  patientId: string;
  patientName: string;
  reasonForVisit: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorName?: string;
  contactNumber?: string;
}

export interface UpdateAppointmentRequestDto {
  patientName?: string;
  reasonForVisit?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  doctorName?: string;
  contactNumber?: string;
}

export interface CancelAppointmentRequestDto {
  reason?: string;
}

// Response DTOs for API endpoints
export interface AppointmentResponse {
  success: true;
  data: import('./AppointmentDto').AppointmentDto;
}

export interface AppointmentListResponse {
  success: true;
  data: import('./AppointmentDto').AppointmentDto[];
}

export interface AppointmentStatsResponse {
  success: true;
  data: import('./AppointmentDto').AppointmentStatsDto;
}

export interface AppointmentOperationResponse {
  success: true;
  message: string;
}

export interface WeeklyAppointmentSummaryResponse {
  success: true;
  data: import('./AppointmentDto').WeeklyAppointmentSummaryDto[];
}