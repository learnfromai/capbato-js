import { Appointment } from '../entities/Appointment';

export interface IAppointmentRepository {
  getAll(): Promise<Appointment[]>;
  create(appointment: Appointment): Promise<string>;
  update(id: string, appointment: Appointment): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<Appointment | undefined>;
  getByPatientId(patientId: string): Promise<Appointment[]>;
  getConfirmedByDate(date: Date): Promise<Appointment[]>;
  getTodayConfirmed(): Promise<Appointment[]>;
  getTodayConfirmedCount(): Promise<number>;
  getByDateAndTime(date: Date, time: string): Promise<Appointment[]>;
  getWeeklySummary(startDate?: Date): Promise<{ date: string; count: number }[]>;
  hasConflictingAppointment(patientId: string, date: Date, excludeId?: string): Promise<boolean>;
  getTimeSlotCount(date: Date, time: string, excludeId?: string): Promise<number>;
}