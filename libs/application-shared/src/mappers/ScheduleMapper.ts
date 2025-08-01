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
      doctorId: schedule.doctorIdString,
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
      dto.doctorId,
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
      dto.doctorId,
      dto.date,
      dto.time
    );
  }

  /**
   * Maps a Schedule entity to TodayDoctorDto
   */
  static toTodayDoctorDto(schedule: Schedule): TodayDoctorDto {
    return {
      doctorName: schedule.doctorIdString, // Using doctorId as doctorName for now
      scheduleId: schedule.stringId,
      time: schedule.timeString,
      formattedTime: schedule.formattedTime,
    };
  }

  /**
   * Maps from plain object (database result) to Schedule entity
   */
  static fromPlainObject(obj: Record<string, unknown>): Schedule {
    const createdAtValue = obj['createdAt'] || obj['created_at'];
    const updatedAtValue = obj['updatedAt'] || obj['updated_at'];
    
    return new Schedule(
      (obj['doctorId'] || obj['doctor_id'] || obj['doctorName'] || obj['doctor_name']) as string,
      obj['date'] as string,
      obj['time'] as string,
      obj['id'] as string,
      createdAtValue ? new Date(createdAtValue as string) : undefined,
      updatedAtValue ? new Date(updatedAtValue as string) : undefined
    );
  }

  /**
   * Maps Schedule entity to plain object (for database storage)
   */
  static toPlainObject(schedule: Schedule): Record<string, unknown> {
    return {
      id: schedule.stringId,
      doctorId: schedule.doctorIdString,
      doctor_id: schedule.doctorIdString, // For legacy database compatibility
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
  static fromPlainObjectArray(objects: Record<string, unknown>[]): Schedule[] {
    return objects.map((obj) => this.fromPlainObject(obj));
  }

  /**
   * Maps array of Schedule entities to plain objects
   */
  static toPlainObjectArray(schedules: Schedule[]): Record<string, unknown>[] {
    return schedules.map((schedule) => this.toPlainObject(schedule));
  }

  /**
   * Creates a minimal DTO for today's doctor (legacy compatibility)
   */
  static toLegacyTodayDoctor(schedule: Schedule | null): { doctor_name: string } {
    return {
      doctor_name: schedule?.doctorIdString || 'N/A',
    };
  }
}