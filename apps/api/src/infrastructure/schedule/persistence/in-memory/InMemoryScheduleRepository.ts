import { injectable } from 'tsyringe';
import { Schedule, ScheduleId } from '@nx-starter/domain';
import type { IScheduleRepository } from '@nx-starter/domain';
import { generateId } from '@nx-starter/utils-core';

/**
 * In-memory implementation of IScheduleRepository
 * Useful for development and testing
 */
@injectable()
export class InMemoryScheduleRepository implements IScheduleRepository {
  private schedules: Map<string, Schedule> = new Map();

  async getAll(activeOnly?: boolean): Promise<Schedule[]> {
    let schedules = Array.from(this.schedules.values());
    
    if (activeOnly) {
      schedules = schedules.filter(schedule => schedule.isFuture() || schedule.isToday());
    }
    
    return schedules.sort((a, b) => {
      // Sort by date first, then by time
      const dateCompare = a.dateString.localeCompare(b.dateString);
      if (dateCompare !== 0) return dateCompare;
      return a.timeString.localeCompare(b.timeString);
    });
  }

  async create(schedule: Schedule): Promise<Schedule> {
    const id = generateId();
    const scheduleWithId = new Schedule(
      schedule.doctorName,
      schedule.date,
      schedule.time,
      id,
      schedule.createdAt,
      schedule.updatedAt
    );

    this.schedules.set(id, scheduleWithId);
    return scheduleWithId;
  }

  async getById(id: ScheduleId): Promise<Schedule | undefined> {
    return this.schedules.get(id.value);
  }

  async getByDate(date: string): Promise<Schedule[]> {
    return Array.from(this.schedules.values())
      .filter(schedule => schedule.dateString === date)
      .sort((a, b) => a.timeString.localeCompare(b.timeString));
  }

  async getByDoctorName(doctorName: string): Promise<Schedule[]> {
    return Array.from(this.schedules.values())
      .filter(schedule => 
        schedule.doctorName.toLowerCase().includes(doctorName.toLowerCase())
      )
      .sort((a, b) => {
        const dateCompare = a.dateString.localeCompare(b.dateString);
        if (dateCompare !== 0) return dateCompare;
        return a.timeString.localeCompare(b.timeString);
      });
  }

  async getTodaySchedules(): Promise<Schedule[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getByDate(today);
  }

  async getTodayFirstDoctor(): Promise<Schedule | undefined> {
    const todaySchedules = await this.getTodaySchedules();
    return todaySchedules.length > 0 ? todaySchedules[0] : undefined;
  }

  async update(schedule: Schedule): Promise<Schedule> {
    if (!schedule.id) {
      throw new Error('Cannot update schedule without ID');
    }

    const existingSchedule = this.schedules.get(schedule.id.value);
    if (!existingSchedule) {
      throw new Error(`Schedule with ID ${schedule.id.value} not found`);
    }

    // Create updated schedule with new updatedAt timestamp
    const updatedSchedule = new Schedule(
      schedule.doctorName,
      schedule.date,
      schedule.time,
      schedule.id,
      schedule.createdAt,
      new Date() // Set updatedAt to current time
    );

    this.schedules.set(schedule.id.value, updatedSchedule);
    return updatedSchedule;
  }

  async delete(id: ScheduleId): Promise<boolean> {
    return this.schedules.delete(id.value);
  }

  async exists(id: ScheduleId): Promise<boolean> {
    return this.schedules.has(id.value);
  }

  async findConflicts(schedule: Schedule): Promise<Schedule[]> {
    return Array.from(this.schedules.values())
      .filter(existingSchedule => {
        // Skip the same schedule if it has an ID
        if (schedule.id && existingSchedule.id?.equals(schedule.id)) {
          return false;
        }
        
        return schedule.conflictsWith(existingSchedule);
      });
  }

  async getStats(): Promise<{
    total: number;
    today: number;
    upcoming: number;
    uniqueDoctors: number;
  }> {
    const allSchedules = Array.from(this.schedules.values());
    const todaySchedules = await this.getTodaySchedules();
    const upcomingSchedules = allSchedules.filter(schedule => 
      schedule.isFuture() || schedule.isToday()
    );
    
    const uniqueDoctors = new Set(
      allSchedules.map(schedule => schedule.doctorName.toLowerCase())
    );

    return {
      total: allSchedules.length,
      today: todaySchedules.length,
      upcoming: upcomingSchedules.length,
      uniqueDoctors: uniqueDoctors.size,
    };
  }

  // Helper methods for testing
  async clear(): Promise<void> {
    this.schedules.clear();
  }

  async seed(schedules: Schedule[]): Promise<void> {
    for (const schedule of schedules) {
      if (schedule.id) {
        this.schedules.set(schedule.id.value, schedule);
      } else {
        await this.create(schedule);
      }
    }
  }

  // Get the internal state for testing
  getInternalState(): Map<string, Schedule> {
    return new Map(this.schedules);
  }
}