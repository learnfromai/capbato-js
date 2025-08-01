import Database from 'better-sqlite3';
import { injectable } from 'tsyringe';
import { Appointment } from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';
import { generateUUID } from '@nx-starter/utils-core';
import { getSqliteDatabase } from '../../../database/connections/SqliteConnection';

interface AppointmentRecord {
  id: string;
  patientId: string;
  patientName: string;
  reasonForVisit: string;
  appointmentDate: string; // SQLite date as string
  appointmentTime: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  contactNumber?: string;
  doctorName?: string;
  createdAt: string; // SQLite datetime as string
  updatedAt?: string;
}

/**
 * SQLite implementation of IAppointmentRepository using better-sqlite3
 * Uses shared database connection
 */
@injectable()
export class SqliteAppointmentRepository implements IAppointmentRepository {
  private db: Database.Database;

  constructor() {
    // Use shared SQLite database connection
    this.db = getSqliteDatabase();
    this.initializeTable();
  }

  private initializeTable(): void {
    // Create appointments table if it doesn't exist
    const createTableStmt = this.db.prepare(`
      CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        patientId TEXT NOT NULL,
        patientName TEXT NOT NULL,
        reasonForVisit TEXT NOT NULL,
        appointmentDate DATE NOT NULL,
        appointmentTime TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'scheduled',
        contactNumber TEXT,
        doctorName TEXT,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME
      )
    `);
    createTableStmt.run();

    // Create indexes
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointmentDate)',
      'CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patientId)',
      'CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status)',
    ];

    indexes.forEach(indexSql => {
      this.db.prepare(indexSql).run();
    });
  }

  async getAll(): Promise<Appointment[]> {
    const stmt = this.db.prepare('SELECT * FROM appointments ORDER BY appointmentDate ASC, appointmentTime ASC');
    const rows = stmt.all() as AppointmentRecord[];
    return rows.map((row) => this.mapToAppointmentEntity(row));
  }

  async create(appointment: Appointment): Promise<string> {
    const id = generateUUID();
    const stmt = this.db.prepare(`
      INSERT INTO appointments (id, patientId, patientName, reasonForVisit, appointmentDate, appointmentTime, status, contactNumber, doctorName, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      appointment.patientId,
      appointment.patientName.value,
      appointment.reasonForVisit.value,
      appointment.appointmentDate.toISOString().split('T')[0], // Date only
      appointment.appointmentTime,
      appointment.status.value,
      appointment.contactNumber?.value || null,
      appointment.doctorName?.value || null,
      appointment.createdAt.toISOString(),
      appointment.updatedAt?.toISOString() || null
    );

    return id;
  }

  async update(id: string, appointment: Appointment): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE appointments 
      SET patientName = ?, reasonForVisit = ?, appointmentDate = ?, appointmentTime = ?, status = ?, contactNumber = ?, doctorName = ?, updatedAt = ?
      WHERE id = ?
    `);

    const result = stmt.run(
      appointment.patientName.value,
      appointment.reasonForVisit.value,
      appointment.appointmentDate.toISOString().split('T')[0],
      appointment.appointmentTime,
      appointment.status.value,
      appointment.contactNumber?.value || null,
      appointment.doctorName?.value || null,
      new Date().toISOString(),
      id
    );

    if (result.changes === 0) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
  }

  async delete(id: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM appointments WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
  }

  async getById(id: string): Promise<Appointment | undefined> {
    const stmt = this.db.prepare('SELECT * FROM appointments WHERE id = ?');
    const row = stmt.get(id) as AppointmentRecord | undefined;
    return row ? this.mapToAppointmentEntity(row) : undefined;
  }

  async getByPatientId(patientId: string): Promise<Appointment[]> {
    const stmt = this.db.prepare('SELECT * FROM appointments WHERE patientId = ? ORDER BY appointmentDate ASC, appointmentTime ASC');
    const rows = stmt.all(patientId) as AppointmentRecord[];
    return rows.map((row) => this.mapToAppointmentEntity(row));
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0];
    const stmt = this.db.prepare('SELECT * FROM appointments WHERE appointmentDate = ? ORDER BY appointmentTime ASC');
    const rows = stmt.all(today) as AppointmentRecord[];
    return rows.map((row) => this.mapToAppointmentEntity(row));
  }

  async getTodayConfirmedAppointments(): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0];
    const stmt = this.db.prepare('SELECT * FROM appointments WHERE appointmentDate = ? AND status = ? ORDER BY appointmentTime ASC');
    const rows = stmt.all(today, 'confirmed') as AppointmentRecord[];
    return rows.map((row) => this.mapToAppointmentEntity(row));
  }

  async getWeeklyAppointmentSummary(): Promise<{ date: string; count: number }[]> {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Saturday)

    const stmt = this.db.prepare(`
      SELECT appointmentDate as date, COUNT(*) as count
      FROM appointments 
      WHERE appointmentDate BETWEEN ? AND ?
      GROUP BY appointmentDate
      ORDER BY appointmentDate ASC
    `);
    
    const rows = stmt.all(
      startOfWeek.toISOString().split('T')[0],
      endOfWeek.toISOString().split('T')[0]
    ) as { date: string; count: number }[];
    
    return rows;
  }

  /**
   * Convert SQLite record to domain entity
   */
  private mapToAppointmentEntity(record: AppointmentRecord): Appointment {
    return new Appointment(
      record.patientId,
      record.patientName,
      record.reasonForVisit,
      new Date(record.appointmentDate),
      record.appointmentTime,
      record.status,
      new Date(record.createdAt),
      record.id,
      record.contactNumber,
      record.doctorName,
      record.updatedAt ? new Date(record.updatedAt) : undefined
    );
  }
}