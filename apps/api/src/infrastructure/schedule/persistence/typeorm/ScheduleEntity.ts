import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('schedules')
export class ScheduleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, name: 'doctor_name' })
  doctorName!: string;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'varchar', length: 5 })
  time!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}