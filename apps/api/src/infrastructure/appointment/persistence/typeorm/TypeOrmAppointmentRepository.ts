import { injectable } from 'tsyringe';
import { Repository, DataSource, Between, In } from 'typeorm';
import { Appointment } from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';
import { AppointmentEntity } from './AppointmentEntity';
import { generateUUID } from '@nx-starter/utils-core';

/**
 * TypeORM implementation of IAppointmentRepository
 * Supports MySQL, PostgreSQL, SQLite via TypeORM
 */
@injectable()
export class TypeOrmAppointmentRepository implements IAppointmentRepository {
  private repository: Repository<AppointmentEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(AppointmentEntity);
  }

  async getAll(): Promise<Appointment[]> {
    const entities = await this.repository.find({
      order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
    });
    return entities.map(this.toDomain);
  }

  async create(appointment: Appointment): Promise<string> {
    const id = generateUUID();
    const entity = this.repository.create({
      id,
      patientId: appointment.patientId,
      patientName: appointment.patientName.value,
      reasonForVisit: appointment.reasonForVisit.value,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      status: appointment.status.value,
      contactNumber: appointment.contactNumber?.value,
      doctorName: appointment.doctorName?.value,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    });

    await this.repository.save(entity);
    return id;
  }

  async update(id: string, appointment: Appointment): Promise<void> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new Error(`Appointment with ID ${id} not found`);
    }

    const updateData: Partial<AppointmentEntity> = {
      patientName: appointment.patientName.value,
      reasonForVisit: appointment.reasonForVisit.value,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      status: appointment.status.value,
      contactNumber: appointment.contactNumber?.value,
      doctorName: appointment.doctorName?.value,
      updatedAt: new Date(),
    };

    await this.repository.update(id, updateData);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
  }

  async getById(id: string): Promise<Appointment | undefined> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : undefined;
  }

  async getByPatientId(patientId: string): Promise<Appointment[]> {
    const entities = await this.repository.find({
      where: { patientId },
      order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
    });
    return entities.map(this.toDomain);
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const entities = await this.repository.find({
      where: {
        appointmentDate: Between(startOfDay, endOfDay),
      },
      order: { appointmentTime: 'ASC' },
    });
    return entities.map(this.toDomain);
  }

  async getTodayConfirmedAppointments(): Promise<Appointment[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const entities = await this.repository.find({
      where: {
        appointmentDate: Between(startOfDay, endOfDay),
        status: 'confirmed',
      },
      order: { appointmentTime: 'ASC' },
    });
    return entities.map(this.toDomain);
  }

  async getWeeklyAppointmentSummary(): Promise<{ date: string; count: number }[]> {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Saturday)

    const entities = await this.repository
      .createQueryBuilder('appointment')
      .select('DATE(appointment.appointmentDate)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('appointment.appointmentDate BETWEEN :start AND :end', {
        start: startOfWeek.toISOString().split('T')[0],
        end: endOfWeek.toISOString().split('T')[0],
      })
      .groupBy('DATE(appointment.appointmentDate)')
      .orderBy('DATE(appointment.appointmentDate)', 'ASC')
      .getRawMany();

    return entities.map(entity => ({
      date: entity.date,
      count: parseInt(entity.count, 10),
    }));
  }

  /**
   * Convert TypeORM entity to domain object
   */
  private toDomain(entity: AppointmentEntity): Appointment {
    return new Appointment(
      entity.patientId,
      entity.patientName,
      entity.reasonForVisit,
      entity.appointmentDate,
      entity.appointmentTime,
      entity.status,
      entity.createdAt,
      entity.id,
      entity.contactNumber,
      entity.doctorName,
      entity.updatedAt
    );
  }
}