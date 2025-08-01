import { Appointment } from '../entities/Appointment';
import { AppointmentDate } from '../value-objects/AppointmentDate';
import { AppointmentTime } from '../value-objects/AppointmentTime';

export interface IAppointmentRepository {
  // Basic CRUD operations
  getAll(): Promise<Appointment[]>;
  create(appointment: Appointment): Promise<string>;
  update(id: string, changes: Partial<Appointment>): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<Appointment | undefined>;

  // Query operations
  getByPatientId(patientId: string): Promise<Appointment[]>;
  getByDate(date: AppointmentDate): Promise<Appointment[]>;
  getByDateRange(startDate: AppointmentDate, endDate: AppointmentDate): Promise<Appointment[]>;
  getByStatus(status: string): Promise<Appointment[]>;
  
  // Today's appointments
  getTodayAppointments(): Promise<Appointment[]>;
  getTodayConfirmedAppointments(): Promise<Appointment[]>;
  getTodayConfirmedCount(): Promise<number>;
  
  // Time slot availability
  getAppointmentsByTimeSlot(date: AppointmentDate, time: AppointmentTime): Promise<Appointment[]>;
  isTimeSlotAvailable(date: AppointmentDate, time: AppointmentTime, maxAppointments?: number): Promise<boolean>;
  
  // Business logic queries
  hasPatientAppointmentOnDate(patientId: string, date: AppointmentDate): Promise<boolean>;
  getWeeklyAppointmentSummary(startDate?: Date): Promise<Array<{ date: string; count: number }>>;
  
  // Statistics
  getAppointmentStats(): Promise<{
    total: number;
    scheduled: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  }>;
  
  // Advanced queries
  getUpcomingAppointments(days?: number): Promise<Appointment[]>;
  getOverdueAppointments(): Promise<Appointment[]>;
  searchAppointments(criteria: {
    patientName?: string;
    doctorName?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<Appointment[]>;
}