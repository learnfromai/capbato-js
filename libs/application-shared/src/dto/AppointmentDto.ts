// Data Transfer Objects for Appointment operations

export interface AppointmentDto {
  id: string;
  patientId: string;
  patientName: string;
  reasonForVisit: string;
  appointmentDate: string; // ISO date string
  appointmentTime: string; // HH:MM format
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  contactNumber?: string;
  doctorName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAppointmentDto {
  patientId: string;
  patientName: string;
  reasonForVisit: string;
  appointmentDate: string; // YYYY-MM-DD format
  appointmentTime: string; // HH:MM format
  doctorName?: string;
  contactNumber?: string;
}

export interface UpdateAppointmentDto {
  patientName?: string;
  reasonForVisit?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  doctorName?: string;
  contactNumber?: string;
}

export interface AppointmentStatsDto {
  total: number;
  confirmed: number;
  scheduled: number;
  cancelled: number;
  completed: number;
  todayConfirmed: number;
}

export interface AppointmentFilterDto {
  status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  patientId?: string;
  doctorName?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface WeeklyAppointmentSummaryDto {
  date: string;
  count: number;
}