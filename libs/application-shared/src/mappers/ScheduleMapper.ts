import { Schedule } from '@nx-starter/domain';
import type { ScheduleDto } from '../dto/ScheduleDto';

/**
 * Mapper for converting between Schedule entities and DTOs
 */
export class ScheduleMapper {
  /**
   * Maps a Schedule entity to a ScheduleDto
   */
  static toDto(schedule: Schedule): ScheduleDto {
    return {
      id: schedule.id?.value.toString() || '',
      doctorName: schedule.doctorName.value,
      date: schedule.date.dateString,
      time: schedule.time.value,
      timeDisplay: schedule.time.to12HourFormat(),
      createdAt: schedule.createdAt.toISOString(),
      displayString: schedule.getDisplayString(),
      isToday: schedule.isToday(),
      isFuture: schedule.isFuture(),
      isPast: schedule.isPast(),
    };
  }

  /**
   * Maps an array of Schedule entities to ScheduleDtos
   */
  static toDtoArray(schedules: Schedule[]): ScheduleDto[] {
    return schedules.map((schedule) => this.toDto(schedule));
  }

  /**
   * Maps a ScheduleDto to a Schedule entity
   */
  static toDomain(dto: ScheduleDto): Schedule {
    return new Schedule(
      dto.doctorName,
      dto.date,
      dto.time,
      new Date(dto.createdAt),
      dto.id || undefined
    );
  }

  /**
   * Converts plain object to Schedule entity
   * Used for ORM/database layer integration
   */
  static fromPlainObject(obj: {
    id?: string;
    doctorName: string;
    date: string | Date;
    time: string;
    createdAt?: string | Date;
  }): Schedule {
    return new Schedule(
      obj.doctorName,
      typeof obj.date === 'string' ? obj.date : obj.date.toISOString().split('T')[0],
      obj.time,
      obj.createdAt ? new Date(obj.createdAt) : new Date(),
      obj.id
    );
  }

  /**
   * Converts Schedule entity to plain object
   * Used for ORM/database layer integration
   */
  static toPlainObject(schedule: Schedule): {
    id?: string;
    doctorName: string;
    date: string;
    time: string;
    createdAt: string;
  } {
    return {
      id: schedule.stringId,
      doctorName: schedule.doctorNameValue,
      date: schedule.dateString,
      time: schedule.timeValue,
      createdAt: schedule.createdAt.toISOString(),
    };
  }
}