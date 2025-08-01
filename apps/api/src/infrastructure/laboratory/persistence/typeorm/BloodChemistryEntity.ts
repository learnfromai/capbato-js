import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('blood_chem')
export class BloodChemistryEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'varchar', length: 255, name: 'patient_name' })
  patientName!: string;

  @Column({ type: 'int' })
  age!: number;

  @Column({ type: 'varchar', length: 10 })
  sex!: string;

  @Column({ type: 'date', name: 'date_taken' })
  dateTaken!: Date;

  // Blood Chemistry Result Fields
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fbs?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  bun?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  creatinine?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'uric_acid' })
  uricAcid?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cholesterol?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  triglycerides?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hdl?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  ldl?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  vldl?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  sodium?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  potassium?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  chloride?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  calcium?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  sgot?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  sgpt?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  rbs?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'alk_phosphatase' })
  alkPhosphatase?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'total_protein' })
  totalProtein?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  albumin?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  globulin?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'ag_ratio' })
  agRatio?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'total_bilirubin' })
  totalBilirubin?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'direct_bilirubin' })
  directBilirubin?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'indirect_bilirubin' })
  indirectBilirubin?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'ionised_calcium' })
  ionisedCalcium?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  magnesium?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hbalc?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'ogtt_30min' })
  ogtt30min?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'ogtt_1hr' })
  ogtt1hr?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'ogtt_2hr' })
  ogtt2hr?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'ppbs_2hr' })
  ppbs2hr?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'inor_phosphorus' })
  inorPhosphorus?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}