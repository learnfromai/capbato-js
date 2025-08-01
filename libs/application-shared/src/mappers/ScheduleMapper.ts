import { Schedule } from '@nx-starter/domain';
import type { ScheduleDto, CreateScheduleDto } from '../dto/ScheduleDto';

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
      date: schedule.dateIsoString,
      time: schedule.timeFormatted24Hour,
      timeFormatted12Hour: schedule.timeFormatted12Hour,
      createdAt: schedule.createdAt.toISOString(),
      updatedAt: schedule.updatedAt?.toISOString(),
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
      dto.id || undefined,
      new Date(dto.createdAt),
      dto.updatedAt ? new Date(dto.updatedAt) : undefined
    );
  }

  /**
   * Maps a CreateScheduleDto to a Schedule entity
   */
  static createToDomain(dto: CreateScheduleDto): Schedule {
    return new Schedule(
      dto.doctorName,
      dto.date,
      dto.time,
      undefined,
      new Date()
    );
  }

  /**
   * Maps a plain object from database to Schedule entity
   * This method is useful for ORM mapping
   */
  static fromPlainObject(obj: {
    id: string;
    doctorName: string;
    date: Date | string;
    time: string;
    createdAt: Date;
    updatedAt?: Date;
  }): Schedule {
    return new Schedule(
      obj.doctorName,
      obj.date,
      obj.time,
      obj.id,
      obj.createdAt,
      obj.updatedAt
    );
  }

  /**
   * Maps Schedule entity to plain object for database storage
   */
  static toPlainObject(
    schedule: Schedule,
    id?: string
  ): {
    id?: string;
    doctorName: string;
    date: Date;
    time: string;
    createdAt: Date;
    updatedAt?: Date;
  } {
    return {
      ...(id && { id }),
      doctorName: schedule.doctorNameValue,
      date: schedule.dateValue,
      time: schedule.timeValue,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    };
  }
}