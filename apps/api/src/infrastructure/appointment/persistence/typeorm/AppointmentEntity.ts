import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('appointments')
@Index(['appointmentDate']) // For date-based searches
@Index(['patientId']) // For patient-based searches
@Index(['status']) // For status-based searches
export class AppointmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36, name: 'patient_id' })
  patientId!: string;

  @Column({ type: 'varchar', length: 100, name: 'patient_name' })
  patientName!: string;

  @Column({ type: 'text', name: 'reason_for_visit' })
  reasonForVisit!: string;

  @Column({ type: 'date', name: 'appointment_date' })
  appointmentDate!: Date;

  @Column({ type: 'varchar', length: 10, name: 'appointment_time' })
  appointmentTime!: string;

  @Column({ 
    type: 'enum', 
    enum: ['scheduled', 'confirmed', 'cancelled', 'completed'],
    default: 'scheduled'
  })
  status!: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';

  @Column({ 
    type: 'varchar', 
    length: 15, 
    nullable: true,
    name: 'contact_number'
  })
  contactNumber?: string;

  @Column({ 
    type: 'varchar', 
    length: 100, 
    nullable: true,
    name: 'doctor_name'
  })
  doctorName?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;
}