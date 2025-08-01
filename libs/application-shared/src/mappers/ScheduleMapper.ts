import { Schedule } from '@nx-starter/domain';
import type { 
  ScheduleDto, 
  CreateScheduleDto, 
  TodayDoctorDto 
} from '../dto/ScheduleDto';

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
      doctorName: schedule.doctorName,
      date: schedule.dateString,
      time: schedule.timeString,
      formattedDate: schedule.formattedDate,
      formattedTime: schedule.formattedTime,
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
      dto.time
    );
  }

  /**
   * Maps a Schedule entity to TodayDoctorDto
   */
  static toTodayDoctorDto(schedule: Schedule): TodayDoctorDto {
    return {
      doctorName: schedule.doctorName,
      scheduleId: schedule.stringId,
      time: schedule.timeString,
      formattedTime: schedule.formattedTime,
    };
  }

  /**
   * Maps from plain object (database result) to Schedule entity
   */
  static fromPlainObject(obj: any): Schedule {
    return new Schedule(
      obj.doctorName || obj.doctor_name,
      obj.date,
      obj.time,
      obj.id,
      obj.createdAt || obj.created_at ? new Date(obj.createdAt || obj.created_at) : undefined,
      obj.updatedAt || obj.updated_at ? new Date(obj.updatedAt || obj.updated_at) : undefined
    );
  }

  /**
   * Maps Schedule entity to plain object (for database storage)
   */
  static toPlainObject(schedule: Schedule): any {
    return {
      id: schedule.stringId,
      doctorName: schedule.doctorName,
      doctor_name: schedule.doctorName, // For legacy database compatibility
      date: schedule.dateString,
      time: schedule.timeString,
      createdAt: schedule.createdAt,
      created_at: schedule.createdAt, // For legacy database compatibility
      updatedAt: schedule.updatedAt,
      updated_at: schedule.updatedAt, // For legacy database compatibility
    };
  }

  /**
   * Maps array of plain objects to Schedule entities
   */
  static fromPlainObjectArray(objects: any[]): Schedule[] {
    return objects.map((obj) => this.fromPlainObject(obj));
  }

  /**
   * Maps array of Schedule entities to plain objects
   */
  static toPlainObjectArray(schedules: Schedule[]): any[] {
    return schedules.map((schedule) => this.toPlainObject(schedule));
  }

  /**
   * Creates a minimal DTO for today's doctor (legacy compatibility)
   */
  static toLegacyTodayDoctor(schedule: Schedule | null): { doctor_name: string } {
    return {
      doctor_name: schedule?.doctorName || 'N/A',
    };
  }
}