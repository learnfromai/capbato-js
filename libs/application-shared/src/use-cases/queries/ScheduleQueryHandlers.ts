import { injectable, inject } from 'tsyringe';
import { Schedule, ScheduleNotFoundException } from '@nx-starter/domain';
import type { IScheduleRepository } from '@nx-starter/domain';
import type {
  GetSchedulesByDoctorQuery,
  GetSchedulesByDateQuery,
  GetSchedulesByDateRangeQuery,
  GetScheduleByIdQuery,
  TodaysDoctorQueryResult,
} from '../../dto/ScheduleQueries';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for getting all schedules
 */
@injectable()
export class GetAllSchedulesQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(): Promise<Schedule[]> {
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
 * Query handler for getting schedules by date
 */
@injectable()
export class GetSchedulesByDateQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(query: GetSchedulesByDateQuery): Promise<Schedule[]> {
    const date = new Date(query.date);
    return await this.scheduleRepository.getByDate(date);
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
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);
    return await this.scheduleRepository.getByDateRange(startDate, endDate);
  }
}

/**
 * Query handler for getting today's schedules
 */
@injectable()
export class GetTodaysSchedulesQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(): Promise<Schedule[]> {
    return await this.scheduleRepository.getTodaysSchedules();
  }
}

/**
 * Query handler for getting today's doctor (first scheduled doctor for today)
 */
@injectable()
export class GetTodaysDoctorQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(): Promise<TodaysDoctorQueryResult> {
    const todaysDoctor = await this.scheduleRepository.getTodaysDoctor();
    return {
      doctorName: todaysDoctor ? todaysDoctor.doctorNameValue : null
    };
  }
}

/**
 * Query handler for getting upcoming schedules
 */
@injectable()
export class GetUpcomingSchedulesQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(): Promise<Schedule[]> {
    return await this.scheduleRepository.getUpcomingSchedules();
  }
}