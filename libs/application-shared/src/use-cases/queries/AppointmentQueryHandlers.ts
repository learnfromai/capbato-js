import { injectable, inject } from 'tsyringe';
import {
  Appointment,
  AppointmentNotFoundException,
  AppointmentDomainService,
  AppointmentDate,
  AppointmentTime,
} from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';
import type {
  GetAllAppointmentsQuery,
  GetAppointmentByIdQuery,
  GetAppointmentsByPatientIdQuery,
  GetAppointmentsByDateQuery,
  GetAppointmentsByDateRangeQuery,
  GetAppointmentsByStatusQuery,
  GetTodayAppointmentsQuery,
  GetTodayConfirmedAppointmentsCountQuery,
  GetWeeklyAppointmentSummaryQuery,
  CheckTimeSlotAvailabilityQuery,
  GetAvailableTimeSlotsQuery,
  GetAppointmentStatsQuery,
  SearchAppointmentsQuery,
  GetUpcomingAppointmentsQuery,
  GetOverdueAppointmentsQuery,
  WeeklyAppointmentSummaryResult,
  TimeSlotAvailabilityResult,
  AvailableTimeSlotsResult,
  AppointmentStatsResult,
} from '../../dto/AppointmentQueries';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for getting all appointments
 */
@injectable()
export class GetAllAppointmentsQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: GetAllAppointmentsQuery): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.getAll();
    return AppointmentDomainService.sortAppointmentsByDateTime(appointments);
  }
}

/**
 * Query handler for getting appointment by ID
 */
@injectable()
export class GetAppointmentByIdQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: GetAppointmentByIdQuery): Promise<Appointment> {
    const appointment = await this.appointmentRepository.getById(query.id);
    if (!appointment) {
      throw new AppointmentNotFoundException(query.id);
    }
    return appointment;
  }
}

/**
 * Query handler for getting appointments by patient ID
 */
@injectable()
export class GetAppointmentsByPatientIdQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: GetAppointmentsByPatientIdQuery): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.getByPatientId(query.patientId);
    return AppointmentDomainService.sortAppointmentsByDateTime(appointments);
  }
}

/**
 * Query handler for getting appointments by date
 */
@injectable()
export class GetAppointmentsByDateQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: GetAppointmentsByDateQuery): Promise<Appointment[]> {
    const appointmentDate = new AppointmentDate(query.date);
    const appointments = await this.appointmentRepository.getByDate(appointmentDate);
    return AppointmentDomainService.sortAppointmentsByDateTime(appointments);
  }
}

/**
 * Query handler for getting appointments by date range
 */
@injectable()
export class GetAppointmentsByDateRangeQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: GetAppointmentsByDateRangeQuery): Promise<Appointment[]> {
    const startDate = new AppointmentDate(query.startDate);
    const endDate = new AppointmentDate(query.endDate);
    const appointments = await this.appointmentRepository.getByDateRange(startDate, endDate);
    return AppointmentDomainService.sortAppointmentsByDateTime(appointments);
  }
}

/**
 * Query handler for getting appointments by status
 */
@injectable()
export class GetAppointmentsByStatusQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: GetAppointmentsByStatusQuery): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.getByStatus(query.status);
    return AppointmentDomainService.sortAppointmentsByDateTime(appointments);
  }
}

/**
 * Query handler for getting today's appointments
 */
@injectable()
export class GetTodayAppointmentsQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: GetTodayAppointmentsQuery): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.getTodayAppointments();
    return AppointmentDomainService.sortAppointmentsByDateTime(appointments);
  }
}

/**
 * Query handler for getting today's confirmed appointments count
 */
@injectable()
export class GetTodayConfirmedAppointmentsCountQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: GetTodayConfirmedAppointmentsCountQuery): Promise<number> {
    return await this.appointmentRepository.getTodayConfirmedCount();
  }
}

/**
 * Query handler for getting weekly appointment summary
 */
@injectable()
export class GetWeeklyAppointmentSummaryQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: GetWeeklyAppointmentSummaryQuery): Promise<WeeklyAppointmentSummaryResult[]> {
    return await this.appointmentRepository.getWeeklyAppointmentSummary(query.startDate);
  }
}

/**
 * Query handler for checking time slot availability
 */
@injectable()
export class CheckTimeSlotAvailabilityQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: CheckTimeSlotAvailabilityQuery): Promise<TimeSlotAvailabilityResult> {
    const appointmentDate = new AppointmentDate(query.date);
    const appointmentTime = new AppointmentTime(query.time);
    const maxAppointments = query.maxAppointments || 4;

    const available = await this.appointmentRepository.isTimeSlotAvailable(
      appointmentDate,
      appointmentTime,
      maxAppointments
    );

    const existingAppointments = await this.appointmentRepository.getAppointmentsByTimeSlot(
      appointmentDate,
      appointmentTime
    );

    const currentCount = existingAppointments.filter(apt => apt.status.isActive()).length;

    return {
      available,
      currentCount,
      maxCount: maxAppointments,
    };
  }
}

/**
 * Query handler for getting available time slots
 */
@injectable()
export class GetAvailableTimeSlotsQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: GetAvailableTimeSlotsQuery): Promise<AvailableTimeSlotsResult> {
    const appointmentDate = new AppointmentDate(query.date);
    const maxAppointments = query.maxAppointments || 4;

    const existingAppointments = await this.appointmentRepository.getByDate(appointmentDate);
    const availableSlots = AppointmentDomainService.getAvailableTimeSlots(
      appointmentDate,
      existingAppointments,
      maxAppointments
    );

    return {
      slots: availableSlots.map(slot => slot.time),
    };
  }
}

/**
 * Query handler for getting appointment statistics
 */
@injectable()
export class GetAppointmentStatsQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: GetAppointmentStatsQuery): Promise<AppointmentStatsResult> {
    const allAppointments = await this.appointmentRepository.getAll();
    return AppointmentDomainService.calculateAppointmentStats(allAppointments);
  }
}

/**
 * Query handler for searching appointments
 */
@injectable()
export class SearchAppointmentsQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: SearchAppointmentsQuery): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.searchAppointments(query);
    return AppointmentDomainService.sortAppointmentsByDateTime(appointments);
  }
}

/**
 * Query handler for getting upcoming appointments
 */
@injectable()
export class GetUpcomingAppointmentsQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: GetUpcomingAppointmentsQuery): Promise<Appointment[]> {
    const days = query.days || 7;
    const appointments = await this.appointmentRepository.getUpcomingAppointments(days);
    return AppointmentDomainService.sortAppointmentsByDateTime(appointments);
  }
}

/**
 * Query handler for getting overdue appointments
 */
@injectable()
export class GetOverdueAppointmentsQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: GetOverdueAppointmentsQuery): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.getOverdueAppointments();
    return AppointmentDomainService.sortAppointmentsByDateTime(appointments);
  }
}