import Database from 'better-sqlite3';
import { injectable } from 'tsyringe';
import { Schedule } from '@nx-starter/domain';
import type { IScheduleRepository } from '@nx-starter/domain';
import { ScheduleMapper } from '@nx-starter/application-shared';
import { generateUUID } from '@nx-starter/utils-core';
import { getSqliteDatabase } from '../../../database/connections/SqliteConnection';

interface ScheduleRecord {
  id: string;
  doctor_name: string;
  date: string;
  time: string;
  created_at: string; // SQLite datetime as string
}

/**
 * SQLite implementation of IScheduleRepository using better-sqlite3
 * Now uses shared database connection
 */
@injectable()
export class SqliteScheduleRepository implements IScheduleRepository {
  private db: Database.Database;

  constructor() {
    // Use shared SQLite database connection
    this.db = getSqliteDatabase();
  }

  async getAll(): Promise<Schedule[]> {
    const stmt = this.db.prepare('SELECT * FROM doctor_schedule ORDER BY date ASC, time ASC');
    const rows = stmt.all() as ScheduleRecord[];
    return rows.map((row) => this.mapToScheduleEntity(row));
  }

  async create(schedule: Schedule): Promise<string> {
    const id = generateUUID();
    const stmt = this.db.prepare(`
      INSERT INTO doctor_schedule (id, doctor_name, date, time, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      schedule.doctorNameValue,
      schedule.dateString,
      schedule.timeValue,
      schedule.createdAt.toISOString()
    );

    return id;
  }

  async update(id: string, changes: Partial<Schedule>): Promise<void> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Schedule with ID ${id} not found`);
    }

    const doctorName = changes.doctorName 
      ? typeof changes.doctorName === 'string' 
        ? changes.doctorName 
        : changes.doctorName.value
      : existing.doctorNameValue;

    const date = changes.date
      ? typeof changes.date === 'string'
        ? changes.date
        : changes.date.dateString
      : existing.dateString;

    const time = changes.time
      ? typeof changes.time === 'string'
        ? changes.time
        : changes.time.value
      : existing.timeValue;

    const stmt = this.db.prepare(`
      UPDATE doctor_schedule 
      SET doctor_name = ?, date = ?, time = ?
      WHERE id = ?
    `);

    const result = stmt.run(doctorName, date, time, id);
    
    if (result.changes === 0) {
      throw new Error(`Schedule with ID ${id} not found`);
    }
  }

  async delete(id: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM doctor_schedule WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      throw new Error(`Schedule with ID ${id} not found`);
    }
  }

  async getById(id: string): Promise<Schedule | undefined> {
    const stmt = this.db.prepare('SELECT * FROM doctor_schedule WHERE id = ?');
    const row = stmt.get(id) as ScheduleRecord | undefined;
    return row ? this.mapToScheduleEntity(row) : undefined;
  }

  async getByDate(date: string): Promise<Schedule[]> {
    const stmt = this.db.prepare('SELECT * FROM doctor_schedule WHERE date = ? ORDER BY time ASC');
    const rows = stmt.all(date) as ScheduleRecord[];
    return rows.map((row) => this.mapToScheduleEntity(row));
  }

  async getTodaySchedules(): Promise<Schedule[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getByDate(today);
  }

  async getByDoctorName(doctorName: string): Promise<Schedule[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM doctor_schedule 
      WHERE LOWER(doctor_name) LIKE LOWER(?) 
      ORDER BY date ASC, time ASC
    `);
    const rows = stmt.all(`%${doctorName}%`) as ScheduleRecord[];
    return rows.map((row) => this.mapToScheduleEntity(row));
  }

  async getByDateRange(startDate: string, endDate: string): Promise<Schedule[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM doctor_schedule 
      WHERE date >= ? AND date <= ? 
      ORDER BY date ASC, time ASC
    `);
    const rows = stmt.all(startDate, endDate) as ScheduleRecord[];
    return rows.map((row) => this.mapToScheduleEntity(row));
  }

  async findBySpecification(specification: any): Promise<Schedule[]> {
    const allSchedules = await this.getAll();
    return allSchedules.filter(schedule => specification.isSatisfiedBy(schedule));
  }

  async existsByDoctorNameAndDateTime(
    doctorName: string,
    date: string,
    time: string
  ): Promise<boolean> {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM doctor_schedule 
      WHERE doctor_name = ? AND date = ? AND time = ?
    `);
    const result = stmt.get(doctorName, date, time) as { count: number };
    return result.count > 0;
  }

  private mapToScheduleEntity(row: ScheduleRecord): Schedule {
    return ScheduleMapper.fromPlainObject({
      id: row.id,
      doctorName: row.doctor_name,
      date: row.date,
      time: row.time,
      createdAt: row.created_at,
    });
  }
}