import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { Schedule } from '@nx-starter/domain';
import type { IScheduleRepository } from '@nx-starter/domain';
import type { Specification } from '@nx-starter/domain';
import { ScheduleEntity } from './ScheduleEntity';
import { generateUUID } from '@nx-starter/utils-core';

/**
 * TypeORM implementation of IScheduleRepository
 * Supports MySQL, PostgreSQL, SQLite via TypeORM
 */
@injectable()
export class TypeOrmScheduleRepository implements IScheduleRepository {
  private repository: Repository<ScheduleEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(ScheduleEntity);
  }

  async getAll(): Promise<Schedule[]> {
    const entities = await this.repository.find({
      order: { date: 'ASC', time: 'ASC' },
    });
    return entities.map(this.toDomain);
  }

  async create(schedule: Schedule): Promise<string> {
    const id = generateUUID();
    const entity = this.repository.create({
      id,
      doctorName: schedule.doctorNameValue,
      date: schedule.dateString,
      time: schedule.timeValue,
      createdAt: schedule.createdAt,
    });

    await this.repository.save(entity);
    return id;
  }

  async update(id: string, changes: Partial<Schedule>): Promise<void> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new Error(`Schedule with ID ${id} not found`);
    }

    const updateData: Partial<ScheduleEntity> = {};

    if (changes.doctorName) {
      updateData.doctorName = typeof changes.doctorName === 'string' 
        ? changes.doctorName 
        : changes.doctorName.value;
    }
    
    if (changes.date) {
      updateData.date = typeof changes.date === 'string'
        ? changes.date
        : changes.date.dateString;
    }
    
    if (changes.time) {
      updateData.time = typeof changes.time === 'string'
        ? changes.time
        : changes.time.value;
    }

    await this.repository.update(id, updateData);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Schedule with ID ${id} not found`);
    }
  }

  async getById(id: string): Promise<Schedule | undefined> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : undefined;
  }

  async getByDate(date: string): Promise<Schedule[]> {
    const entities = await this.repository.find({
      where: { date },
      order: { time: 'ASC' },
    });
    return entities.map(this.toDomain);
  }

  async getTodaySchedules(): Promise<Schedule[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getByDate(today);
  }

  async getByDoctorName(doctorName: string): Promise<Schedule[]> {
    const entities = await this.repository
      .createQueryBuilder('schedule')
      .where('LOWER(schedule.doctor_name) LIKE LOWER(:doctorName)', {
        doctorName: `%${doctorName}%`,
      })
      .orderBy('schedule.date', 'ASC')
      .addOrderBy('schedule.time', 'ASC')
      .getMany();

    return entities.map(this.toDomain);
  }

  async getByDateRange(startDate: string, endDate: string): Promise<Schedule[]> {
    const entities = await this.repository
      .createQueryBuilder('schedule')
      .where('schedule.date >= :startDate AND schedule.date <= :endDate', {
        startDate,
        endDate,
      })
      .orderBy('schedule.date', 'ASC')
      .addOrderBy('schedule.time', 'ASC')
      .getMany();

    return entities.map(this.toDomain);
  }

  async findBySpecification(specification: Specification<Schedule>): Promise<Schedule[]> {
    const allSchedules = await this.getAll();
    return allSchedules.filter(schedule => specification.isSatisfiedBy(schedule));
  }

  async existsByDoctorNameAndDateTime(
    doctorName: string,
    date: string,
    time: string
  ): Promise<boolean> {
    const count = await this.repository.count({
      where: {
        doctorName,
        date,
        time,
      },
    });
    return count > 0;
  }

  private toDomain(entity: ScheduleEntity): Schedule {
    return new Schedule(
      entity.doctorName,
      entity.date,
      entity.time,
      entity.createdAt,
      entity.id
    );
  }
}