import { injectable } from 'tsyringe';
import { Appointment } from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';
import { generateId } from '@nx-starter/utils-core';

/**
 * In-memory implementation of IAppointmentRepository
 * Useful for development and testing
 */
@injectable()
export class InMemoryAppointmentRepository implements IAppointmentRepository {
  private appointments: Map<string, Appointment> = new Map();

  async getAll(): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async create(appointment: Appointment): Promise<string> {
    const id = generateId();
    const appointmentWithId = new Appointment(
      appointment.patientId,
      appointment.patientName,
      appointment.reasonForVisit,
      appointment.appointmentDate,
      appointment.appointmentTime,
      appointment.status.value,
      appointment.createdAt,
      id,
      appointment.contactNumber,
      appointment.doctorName,
      appointment.updatedAt
    );

    this.appointments.set(id, appointmentWithId);
    return id;
  }

  async update(id: string, appointment: Appointment): Promise<void> {
    const existing = this.appointments.get(id);
    if (!existing) {
      throw new Error(`Appointment with ID ${id} not found`);
    }

    const updatedAppointment = new Appointment(
      appointment.patientId,
      appointment.patientName,
      appointment.reasonForVisit,
      appointment.appointmentDate,
      appointment.appointmentTime,
      appointment.status.value,
      existing.createdAt,
      id,
      appointment.contactNumber,
      appointment.doctorName,
      new Date() // updatedAt
    );

    this.appointments.set(id, updatedAppointment);
  }

  async delete(id: string): Promise<void> {
    const exists = this.appointments.has(id);
    if (!exists) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
    this.appointments.delete(id);
  }

  async getById(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getByPatientId(patientId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(appointment => appointment.patientId === patientId)
      .sort((a, b) => b.appointmentDate.getTime() - a.appointmentDate.getTime());
  }

  async getConfirmedByDate(date: Date): Promise<Appointment[]> {
    const dateStr = date.toDateString();
    return Array.from(this.appointments.values())
      .filter(appointment => 
        appointment.appointmentDate.toDateString() === dateStr &&
        appointment.status.isConfirmed()
      )
      .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime));
  }

  async getTodayConfirmed(): Promise<Appointment[]> {
    return this.getConfirmedByDate(new Date());
  }

  async getTodayConfirmedCount(): Promise<number> {
    const today = await this.getTodayConfirmed();
    return today.length;
  }

  async getByDateAndTime(date: Date, time: string): Promise<Appointment[]> {
    const dateStr = date.toDateString();
    return Array.from(this.appointments.values())
      .filter(appointment => 
        appointment.appointmentDate.toDateString() === dateStr &&
        appointment.appointmentTime === time
      );
  }

  async getWeeklySummary(startDate?: Date): Promise<{ date: string; count: number }[]> {
    const start = startDate || new Date(Date.now() - 6 * 24 * 60 * 60 * 1000); // 6 days ago
    const end = new Date();
    
    const dateMap = new Map<string, number>();
    
    // Initialize dates with 0 count
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dateMap.set(dateStr, 0);
    }

    // Count confirmed appointments
    Array.from(this.appointments.values())
      .filter(appointment => 
        appointment.status.isConfirmed() &&
        appointment.appointmentDate >= start &&
        appointment.appointmentDate <= end
      )
      .forEach(appointment => {
        const dateStr = appointment.getFormattedDate();
        const current = dateMap.get(dateStr) || 0;
        dateMap.set(dateStr, current + 1);
      });

    return Array.from(dateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async hasConflictingAppointment(patientId: string, date: Date, excludeId?: string): Promise<boolean> {
    const dateStr = date.toDateString();
    return Array.from(this.appointments.values()).some(appointment =>
      appointment.id?.value !== excludeId &&
      appointment.patientId === patientId &&
      appointment.appointmentDate.toDateString() === dateStr &&
      appointment.status.isConfirmed()
    );
  }

  async getTimeSlotCount(date: Date, time: string, excludeId?: string): Promise<number> {
    const dateStr = date.toDateString();
    return Array.from(this.appointments.values())
      .filter(appointment =>
        appointment.id?.value !== excludeId &&
        appointment.appointmentDate.toDateString() === dateStr &&
        appointment.appointmentTime === time &&
        appointment.status.isConfirmed()
      ).length;
  }
}