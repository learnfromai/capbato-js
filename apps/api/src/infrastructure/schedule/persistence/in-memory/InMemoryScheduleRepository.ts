import { injectable } from 'tsyringe';
import { Schedule } from '@nx-starter/domain';
import type { IScheduleRepository } from '@nx-starter/domain';
import type { Specification } from '@nx-starter/domain';
import { generateId } from '@nx-starter/utils-core';

/**
 * In-memory implementation of IScheduleRepository
 * Useful for development and testing
 */
@injectable()
export class InMemoryScheduleRepository implements IScheduleRepository {
  private schedules: Map<string, Schedule> = new Map();

  async getAll(): Promise<Schedule[]> {
    return Array.from(this.schedules.values()).sort(
      (a, b) => {
        // First sort by date
        const dateComparison = a.dateValue.getTime() - b.dateValue.getTime();
        if (dateComparison !== 0) return dateComparison;
        
        // Then sort by time
        if (a.time.hour !== b.time.hour) {
          return a.time.hour - b.time.hour;
        }
        return a.time.minute - b.time.minute;
      }
    );
  }

  async create(schedule: Schedule): Promise<string> {
    const id = generateId();
    const scheduleWithId = new Schedule(
      schedule.doctorName.value,
      schedule.date.dateString,
      schedule.time.value,
      schedule.createdAt,
      id
    );

    this.schedules.set(id, scheduleWithId);
    return id;
  }

  async update(id: string, changes: Partial<Schedule>): Promise<void> {
    const existingSchedule = this.schedules.get(id);
    if (!existingSchedule) {
      throw new Error(`Schedule with ID ${id} not found`);
    }

    // Create updated schedule with changes
    const updatedSchedule = new Schedule(
      changes.doctorName !== undefined
        ? typeof changes.doctorName === 'string'
          ? changes.doctorName
          : changes.doctorName && typeof changes.doctorName === 'object' && 'value' in changes.doctorName
            ? (changes.doctorName as any).value
            : existingSchedule.doctorName.value
        : existingSchedule.doctorName.value,
      changes.date !== undefined
        ? typeof changes.date === 'string'
          ? changes.date
          : changes.date && typeof changes.date === 'object' && 'dateString' in changes.date
            ? (changes.date as any).dateString
            : changes.date && typeof changes.date === 'object' && 'value' in changes.date
              ? (changes.date as any).value
              : existingSchedule.date.dateString
        : existingSchedule.date.dateString,
      changes.time !== undefined
        ? typeof changes.time === 'string'
          ? changes.time
          : changes.time && typeof changes.time === 'object' && 'value' in changes.time
            ? (changes.time as any).value
            : existingSchedule.time.value
        : existingSchedule.time.value,
      existingSchedule.createdAt,
      id
    );

    this.schedules.set(id, updatedSchedule);
  }

  async delete(id: string): Promise<void> {
    const exists = this.schedules.has(id);
    if (!exists) {
      throw new Error(`Schedule with ID ${id} not found`);
    }
    this.schedules.delete(id);
  }

  async getById(id: string): Promise<Schedule | undefined> {
    return this.schedules.get(id);
  }

  async getByDate(date: string): Promise<Schedule[]> {
    const allSchedules = await this.getAll();
    return allSchedules.filter(schedule => schedule.date.dateString === date);
  }

  async getTodaySchedules(): Promise<Schedule[]> {
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0];
    return this.getByDate(todayDateString);
  }

  async getByDoctorName(doctorName: string): Promise<Schedule[]> {
    const allSchedules = await this.getAll();
    return allSchedules.filter(schedule => 
      schedule.doctorName.value.toLowerCase().includes(doctorName.toLowerCase())
    );
  }

  async getByDateRange(startDate: string, endDate: string): Promise<Schedule[]> {
    const allSchedules = await this.getAll();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return allSchedules.filter(schedule => {
      const scheduleDate = schedule.dateValue;
      return scheduleDate >= start && scheduleDate <= end;
    });
  }

  async findBySpecification(specification: Specification<Schedule>): Promise<Schedule[]> {
    const allSchedules = await this.getAll();
    return allSchedules.filter(schedule => specification.isSatisfiedBy(schedule));
  }

  async existsByDoctorNameAndDateTime(
    doctorName: string,
    date: string,
    time: string
  ): Promise<boolean> {
    const allSchedules = await this.getAll();
    return allSchedules.some(schedule =>
      schedule.doctorName.value === doctorName &&
      schedule.date.dateString === date &&
      schedule.time.value === time
    );
  }

  // Utility methods for testing
  async clear(): Promise<void> {
    this.schedules.clear();
  }

  async count(): Promise<number> {
    return this.schedules.size;
  }
}