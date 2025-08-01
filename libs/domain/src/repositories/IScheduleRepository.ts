import { Schedule } from '../entities/Schedule';

export interface IScheduleRepository {
  getAll(): Promise<Schedule[]>;
  create(schedule: Schedule): Promise<string>;
  update(id: string, schedule: Schedule): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<Schedule | undefined>;
  getByDoctorName(doctorName: string): Promise<Schedule[]>;
  getByDate(date: Date): Promise<Schedule[]>;
  getByDateRange(startDate: Date, endDate: Date): Promise<Schedule[]>;
  getTodaysSchedules(): Promise<Schedule[]>;
  getTodaysDoctor(): Promise<Schedule | undefined>;
  findConflictingSchedule(doctorName: string, date: Date, time: string): Promise<Schedule | undefined>;
  getUpcomingSchedules(): Promise<Schedule[]>;
}