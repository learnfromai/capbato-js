import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('lab_request_entries')
export class LabRequestEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'varchar', length: 50, name: 'patient_id' })
  patientId!: string;

  @Column({ type: 'varchar', length: 255, name: 'patient_name' })
  patientName!: string;

  @Column({ type: 'varchar', length: 50, name: 'age_gender' })
  ageGender!: string;

  @Column({ type: 'date', name: 'request_date' })
  requestDate!: Date;

  @Column({ type: 'text', nullable: true })
  others?: string;

  @Column({ type: 'varchar', length: 20, default: 'Pending' })
  status!: string;

  @Column({ type: 'date', nullable: true, name: 'date_taken' })
  dateTaken?: Date;

  // Lab Test Fields
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'cbc_with_platelet', default: '' })
  cbcWithPlatelet?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'pregnancy_test', default: '' })
  pregnancyTest?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  urinalysis?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  fecalysis?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'occult_blood_test', default: '' })
  occultBloodTest?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'hepa_b_screening', default: '' })
  hepaBScreening?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'hepa_a_screening', default: '' })
  hepaAScreening?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'hepatitis_profile', default: '' })
  hepatitisProfile?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'vdrl_rpr', default: '' })
  vdrlRpr?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'dengue_ns1', default: '' })
  dengueNs1?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'ca_125_cea_psa', default: '' })
  ca125CeaPsa?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  fbs?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  bun?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  creatinine?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'blood_uric_acid', default: '' })
  bloodUricAcid?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'lipid_profile', default: '' })
  lipidProfile?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  sgot?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  sgpt?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  alp?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'sodium_na', default: '' })
  sodiumNa?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'potassium_k', default: '' })
  potassiumK?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  hbalc?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  ecg?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  t3?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  t4?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  ft3?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  ft4?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  tsh?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}