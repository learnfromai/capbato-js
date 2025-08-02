import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('appointments')
export class AppointmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36, name: 'patient_id' })
  patientId!: string;

  @Column({ type: 'text', name: 'reason_for_visit' })
  reasonForVisit!: string;

  @Column({ type: 'date', name: 'appointment_date' })
  appointmentDate!: Date;

  @Column({ type: 'varchar', length: 5, name: 'appointment_time' })
  appointmentTime!: string;

  @Column({ type: 'varchar', length: 20, default: 'scheduled' })
  status!: string;

  @Column({ type: 'varchar', length: 36, name: 'doctor_id' })
  doctorId!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;
}
