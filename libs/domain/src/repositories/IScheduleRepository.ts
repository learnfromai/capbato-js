import { Schedule } from '../entities/Schedule';
import { type Specification } from '../specifications/Specification';

export interface IScheduleRepository {
  getAll(): Promise<Schedule[]>;
  create(schedule: Schedule): Promise<string>;
  update(id: string, changes: Partial<Schedule>): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<Schedule | undefined>;
  getByDate(date: string): Promise<Schedule[]>;
  getTodaySchedules(): Promise<Schedule[]>;
  getByDoctorName(doctorName: string): Promise<Schedule[]>;
  getByDateRange(startDate: string, endDate: string): Promise<Schedule[]>;
  findBySpecification(specification: Specification<Schedule>): Promise<Schedule[]>;
  existsByDoctorNameAndDateTime(doctorName: string, date: string, time: string): Promise<boolean>;
}