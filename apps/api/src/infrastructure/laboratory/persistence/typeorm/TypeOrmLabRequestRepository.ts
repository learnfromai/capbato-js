import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { LabRequest } from '@nx-starter/domain';
import type { ILabRequestRepository } from '@nx-starter/domain';
import { LabRequestEntity } from './LabRequestEntity';
import { LabRequestMapper } from '@nx-starter/application-shared';

/**
 * TypeORM implementation of ILabRequestRepository
 * Supports MySQL, PostgreSQL, SQLite via TypeORM
 */
@injectable()
export class TypeOrmLabRequestRepository implements ILabRequestRepository {
  private repository: Repository<LabRequestEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(LabRequestEntity);
  }

  async getAll(): Promise<LabRequest[]> {
    const entities = await this.repository.find({
      order: { requestDate: 'DESC', id: 'DESC' },
    });
    return entities.map(this.toDomain);
  }

  async create(labRequest: LabRequest): Promise<string> {
    const plainObject = LabRequestMapper.toPlainObject(labRequest);
    const entity = this.repository.create({
      patientId: plainObject.patient_id,
      patientName: plainObject.patient_name,
      ageGender: plainObject.age_gender,
      requestDate: plainObject.request_date,
      others: plainObject.others,
      status: plainObject.status,
      dateTaken: plainObject.date_taken,
      // Map test fields
      cbcWithPlatelet: plainObject.cbc_with_platelet || '',
      pregnancyTest: plainObject.pregnancy_test || '',
      urinalysis: plainObject.urinalysis || '',
      fecalysis: plainObject.fecalysis || '',
      occultBloodTest: plainObject.occult_blood_test || '',
      hepaBScreening: plainObject.hepa_b_screening || '',
      hepaAScreening: plainObject.hepa_a_screening || '',
      hepatitisProfile: plainObject.hepatitis_profile || '',
      vdrlRpr: plainObject.vdrl_rpr || '',
      dengueNs1: plainObject.dengue_ns1 || '',
      ca125CeaPsa: plainObject.ca_125_cea_psa || '',
      fbs: plainObject.fbs || '',
      bun: plainObject.bun || '',
      creatinine: plainObject.creatinine || '',
      bloodUricAcid: plainObject.blood_uric_acid || '',
      lipidProfile: plainObject.lipid_profile || '',
      sgot: plainObject.sgot || '',
      sgpt: plainObject.sgpt || '',
      alp: plainObject.alp || '',
      sodiumNa: plainObject.sodium_na || '',
      potassiumK: plainObject.potassium_k || '',
      hbalc: plainObject.hbalc || '',
      ecg: plainObject.ecg || '',
      t3: plainObject.t3 || '',
      t4: plainObject.t4 || '',
      ft3: plainObject.ft3 || '',
      ft4: plainObject.ft4 || '',
      tsh: plainObject.tsh || '',
    });

    const savedEntity = await this.repository.save(entity);
    return savedEntity.id.toString();
  }

  async update(id: string, changes: Partial<LabRequest>): Promise<void> {
    const entity = await this.repository.findOne({ where: { id: parseInt(id) } });
    if (!entity) {
      throw new Error(`Lab request with ID ${id} not found`);
    }

    const updateData: Partial<LabRequestEntity> = {};
    
    if (changes.status !== undefined) {
      updateData.status = changes.status;
    }
    if (changes.dateTaken !== undefined) {
      updateData.dateTaken = changes.dateTaken;
    }

    await this.repository.update(parseInt(id), updateData);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(parseInt(id));
    if (result.affected === 0) {
      throw new Error(`Lab request with ID ${id} not found`);
    }
  }

  async getById(id: string): Promise<LabRequest | undefined> {
    const entity = await this.repository.findOne({ where: { id: parseInt(id) } });
    return entity ? this.toDomain(entity) : undefined;
  }

  async getByPatientId(patientId: string): Promise<LabRequest[]> {
    const entities = await this.repository.find({
      where: { patientId },
      order: { requestDate: 'DESC', id: 'DESC' },
    });
    return entities.map(this.toDomain);
  }

  async getCompletedRequests(): Promise<LabRequest[]> {
    const entities = await this.repository.find({
      where: { status: 'Complete' },
      order: { dateTaken: 'DESC', requestDate: 'DESC' },
      take: 10, // Limit to 10 most recent as per legacy implementation
    });
    return entities.map(this.toDomain);
  }

  async getByPatientIdAndDate(patientId: string, requestDate: Date): Promise<LabRequest | undefined> {
    const entity = await this.repository.findOne({
      where: { 
        patientId,
        requestDate 
      },
    });
    return entity ? this.toDomain(entity) : undefined;
  }

  async updateResults(patientId: string, requestDate: Date, results: Record<string, string>): Promise<void> {
    // Find the lab request by patient ID and request date
    const entity = await this.repository.findOne({
      where: { 
        patientId,
        requestDate 
      },
    });

    if (!entity) {
      throw new Error(`Lab request for patient ${patientId} on ${requestDate.toISOString()} not found`);
    }

    // Prepare update data
    const updateData: Partial<LabRequestEntity> = {};
    
    // Map result fields
    if (results.fbs) updateData.fbs = results.fbs;
    if (results.bun) updateData.bun = results.bun;
    if (results.creatinine) updateData.creatinine = results.creatinine;
    if (results.blood_uric_acid) updateData.bloodUricAcid = results.blood_uric_acid;
    if (results.lipid_profile) updateData.lipidProfile = results.lipid_profile;
    if (results.sgot) updateData.sgot = results.sgot;
    if (results.sgpt) updateData.sgpt = results.sgpt;
    if (results.alp) updateData.alp = results.alp;
    if (results.sodium_na) updateData.sodiumNa = results.sodium_na;
    if (results.potassium_k) updateData.potassiumK = results.potassium_k;
    if (results.hbalc) updateData.hbalc = results.hbalc;
    if (results.ecg) updateData.ecg = results.ecg;
    if (results.t3) updateData.t3 = results.t3;
    if (results.t4) updateData.t4 = results.t4;
    if (results.ft3) updateData.ft3 = results.ft3;
    if (results.ft4) updateData.ft4 = results.ft4;
    if (results.tsh) updateData.tsh = results.tsh;
    if (results.status) updateData.status = results.status;
    if (results.date_taken) updateData.dateTaken = new Date(results.date_taken);

    await this.repository.update(entity.id, updateData);
  }

  /**
   * Converts TypeORM entity to domain object
   */
  private toDomain(entity: LabRequestEntity): LabRequest {
    return LabRequestMapper.fromPlainObject({
      id: entity.id.toString(),
      patient_id: entity.patientId,
      patient_name: entity.patientName,
      age_gender: entity.ageGender,
      request_date: entity.requestDate,
      others: entity.others,
      status: entity.status,
      date_taken: entity.dateTaken,
      // Test fields
      cbc_with_platelet: entity.cbcWithPlatelet,
      pregnancy_test: entity.pregnancyTest,
      urinalysis: entity.urinalysis,
      fecalysis: entity.fecalysis,
      occult_blood_test: entity.occultBloodTest,
      hepa_b_screening: entity.hepaBScreening,
      hepa_a_screening: entity.hepaAScreening,
      hepatitis_profile: entity.hepatitisProfile,
      vdrl_rpr: entity.vdrlRpr,
      dengue_ns1: entity.dengueNs1,
      ca_125_cea_psa: entity.ca125CeaPsa,
      fbs: entity.fbs,
      bun: entity.bun,
      creatinine: entity.creatinine,
      blood_uric_acid: entity.bloodUricAcid,
      lipid_profile: entity.lipidProfile,
      sgot: entity.sgot,
      sgpt: entity.sgpt,
      alp: entity.alp,
      sodium_na: entity.sodiumNa,
      potassium_k: entity.potassiumK,
      hbalc: entity.hbalc,
      ecg: entity.ecg,
      t3: entity.t3,
      t4: entity.t4,
      ft3: entity.ft3,
      ft4: entity.ft4,
      tsh: entity.tsh,
    });
  }
}