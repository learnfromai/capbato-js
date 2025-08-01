import { injectable, inject } from 'tsyringe';
import {
  Schedule,
  ScheduleNotFoundException,
} from '@nx-starter/domain';
import type { IScheduleRepository } from '@nx-starter/domain';
import type {
  GetAllSchedulesQuery,
  GetScheduleByIdQuery,
  GetSchedulesByDateQuery,
  GetTodaySchedulesQuery,
  GetSchedulesByDoctorQuery,
  GetSchedulesByDateRangeQuery,
  GetScheduleStatsQuery,
  GetTodayDoctorQuery,
} from '../../dto/ScheduleQueries';
import type { ScheduleStatsDto, TodayDoctorDto } from '../../dto/ScheduleDto';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for getting all schedules
 */
@injectable()
export class GetAllSchedulesQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(_query?: GetAllSchedulesQuery): Promise<Schedule[]> {
    return await this.scheduleRepository.getAll();
  }
}

/**
 * Query handler for getting schedule by ID
 */
@injectable()
export class GetScheduleByIdQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(query: GetScheduleByIdQuery): Promise<Schedule> {
    const schedule = await this.scheduleRepository.getById(query.id);
    if (!schedule) {
      throw new ScheduleNotFoundException(query.id);
    }
    return schedule;
  }
}

/**
 * Query handler for getting schedules by date
 */
@injectable()
export class GetSchedulesByDateQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(query: GetSchedulesByDateQuery): Promise<Schedule[]> {
    return await this.scheduleRepository.getByDate(query.date);
  }
}

/**
 * Query handler for getting today's schedules
 */
@injectable()
export class GetTodaySchedulesQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(_query?: GetTodaySchedulesQuery): Promise<Schedule[]> {
    return await this.scheduleRepository.getTodaySchedules();
  }
}

/**
 * Query handler for getting schedules by doctor name
 */
@injectable()
export class GetSchedulesByDoctorQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(query: GetSchedulesByDoctorQuery): Promise<Schedule[]> {
    return await this.scheduleRepository.getByDoctorName(query.doctorName);
  }
}

/**
 * Query handler for getting schedules by date range
 */
@injectable()
export class GetSchedulesByDateRangeQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(query: GetSchedulesByDateRangeQuery): Promise<Schedule[]> {
    return await this.scheduleRepository.getByDateRange(query.startDate, query.endDate);
  }
}

/**
 * Query handler for getting schedule statistics
 */
@injectable()
export class GetScheduleStatsQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(_query?: GetScheduleStatsQuery): Promise<ScheduleStatsDto> {
    const allSchedules = await this.scheduleRepository.getAll();
    const todaySchedules = await this.scheduleRepository.getTodaySchedules();
    
    const today = new Date();
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const upcoming = allSchedules.filter(schedule => schedule.isFuture()).length;
    const past = allSchedules.filter(schedule => schedule.isPast()).length;
    
    // Get unique doctors
    const uniqueDoctors = new Set(allSchedules.map(schedule => schedule.doctorNameValue)).size;
    
    // Calculate average schedules per day (for schedules in the past 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSchedules = allSchedules.filter(schedule => {
      const scheduleDate = schedule.dateValue;
      return scheduleDate >= thirtyDaysAgo && scheduleDate <= today;
    });
    
    const averageSchedulesPerDay = recentSchedules.length > 0 ? recentSchedules.length / 30 : 0;

    return {
      total: allSchedules.length,
      today: todaySchedules.length,
      upcoming,
      past,
      uniqueDoctors,
      averageSchedulesPerDay: Math.round(averageSchedulesPerDay * 100) / 100, // Round to 2 decimal places
    };
  }
}

/**
 * Query handler for getting today's doctor (first doctor scheduled for today)
 */
@injectable()
export class GetTodayDoctorQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(_query?: GetTodayDoctorQuery): Promise<TodayDoctorDto> {
    const todaySchedules = await this.scheduleRepository.getTodaySchedules();
    
    if (todaySchedules.length === 0) {
      return {
        doctorName: 'N/A',
        hasSchedule: false,
      };
    }

    // Get the first schedule for today (earliest time)
    const firstSchedule = todaySchedules.sort((a, b) => {
      if (a.time.hour !== b.time.hour) {
        return a.time.hour - b.time.hour;
      }
      return a.time.minute - b.time.minute;
    })[0];

    return {
      doctorName: firstSchedule.doctorNameValue,
      hasSchedule: true,
      scheduleTime: firstSchedule.timeValue,
      scheduleTimeDisplay: firstSchedule.time.to12HourFormat(),
    };
  }
}