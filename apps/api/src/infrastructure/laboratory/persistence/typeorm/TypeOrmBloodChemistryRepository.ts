import { injectable } from 'tsyringe';
import { Repository, DataSource, Between } from 'typeorm';
import { BloodChemistry } from '@nx-starter/domain';
import type { IBloodChemistryRepository } from '@nx-starter/domain';
import { BloodChemistryEntity } from './BloodChemistryEntity';
import { BloodChemistryMapper } from '@nx-starter/application-shared';

/**
 * TypeORM implementation of IBloodChemistryRepository
 * Supports MySQL, PostgreSQL, SQLite via TypeORM
 */
@injectable()
export class TypeOrmBloodChemistryRepository implements IBloodChemistryRepository {
  private repository: Repository<BloodChemistryEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(BloodChemistryEntity);
  }

  async getAll(): Promise<BloodChemistry[]> {
    const entities = await this.repository.find({
      order: { dateTaken: 'DESC', id: 'DESC' },
    });
    return entities.map(this.toDomain);
  }

  async create(bloodChemistry: BloodChemistry): Promise<string> {
    const plainObject = BloodChemistryMapper.toPlainObject(bloodChemistry);
    const entity = this.repository.create({
      patientName: plainObject.patient_name,
      age: plainObject.age,
      sex: plainObject.sex,
      dateTaken: plainObject.date_taken,
      // Map result fields
      fbs: this.parseNumericValue(plainObject.fbs),
      bun: this.parseNumericValue(plainObject.bun),
      creatinine: this.parseNumericValue(plainObject.creatinine),
      uricAcid: this.parseNumericValue(plainObject.uric_acid),
      cholesterol: this.parseNumericValue(plainObject.cholesterol),
      triglycerides: this.parseNumericValue(plainObject.triglycerides),
      hdl: this.parseNumericValue(plainObject.hdl),
      ldl: this.parseNumericValue(plainObject.ldl),
      vldl: this.parseNumericValue(plainObject.vldl),
      sodium: this.parseNumericValue(plainObject.sodium),
      potassium: this.parseNumericValue(plainObject.potassium),
      chloride: this.parseNumericValue(plainObject.chloride),
      calcium: this.parseNumericValue(plainObject.calcium),
      sgot: this.parseNumericValue(plainObject.sgot),
      sgpt: this.parseNumericValue(plainObject.sgpt),
      rbs: this.parseNumericValue(plainObject.rbs),
      alkPhosphatase: this.parseNumericValue(plainObject.alk_phosphatase),
      totalProtein: this.parseNumericValue(plainObject.total_protein),
      albumin: this.parseNumericValue(plainObject.albumin),
      globulin: this.parseNumericValue(plainObject.globulin),
      agRatio: this.parseNumericValue(plainObject.ag_ratio),
      totalBilirubin: this.parseNumericValue(plainObject.total_bilirubin),
      directBilirubin: this.parseNumericValue(plainObject.direct_bilirubin),
      indirectBilirubin: this.parseNumericValue(plainObject.indirect_bilirubin),
      ionisedCalcium: this.parseNumericValue(plainObject.ionised_calcium),
      magnesium: this.parseNumericValue(plainObject.magnesium),
      hbalc: this.parseNumericValue(plainObject.hbalc),
      ogtt30min: this.parseNumericValue(plainObject.ogtt_30min),
      ogtt1hr: this.parseNumericValue(plainObject.ogtt_1hr),
      ogtt2hr: this.parseNumericValue(plainObject.ogtt_2hr),
      ppbs2hr: this.parseNumericValue(plainObject.ppbs_2hr),
      inorPhosphorus: this.parseNumericValue(plainObject.inor_phosphorus),
    });

    const savedEntity = await this.repository.save(entity);
    return savedEntity.id.toString();
  }

  async update(id: string, changes: Partial<BloodChemistry>): Promise<void> {
    const entity = await this.repository.findOne({ where: { id: parseInt(id) } });
    if (!entity) {
      throw new Error(`Blood chemistry with ID ${id} not found`);
    }

    const updateData: Partial<BloodChemistryEntity> = {};
    
    // Handle updates - this would need to be expanded based on requirements
    if (changes.age !== undefined) {
      updateData.age = changes.age;
    }

    await this.repository.update(parseInt(id), updateData);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(parseInt(id));
    if (result.affected === 0) {
      throw new Error(`Blood chemistry with ID ${id} not found`);
    }
  }

  async getById(id: string): Promise<BloodChemistry | undefined> {
    const entity = await this.repository.findOne({ where: { id: parseInt(id) } });
    return entity ? this.toDomain(entity) : undefined;
  }

  async getByPatientName(patientName: string): Promise<BloodChemistry[]> {
    const entities = await this.repository.find({
      where: { patientName },
      order: { dateTaken: 'DESC', id: 'DESC' },
    });
    return entities.map(this.toDomain);
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<BloodChemistry[]> {
    const entities = await this.repository.find({
      where: { 
        dateTaken: Between(startDate, endDate)
      },
      order: { dateTaken: 'DESC', id: 'DESC' },
    });
    return entities.map(this.toDomain);
  }

  /**
   * Parse numeric values from string or number
   */
  private parseNumericValue(value: any): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  }

  /**
   * Converts TypeORM entity to domain object
   */
  private toDomain(entity: BloodChemistryEntity): BloodChemistry {
    return BloodChemistryMapper.fromPlainObject({
      id: entity.id.toString(),
      patient_name: entity.patientName,
      age: entity.age,
      sex: entity.sex,
      date_taken: entity.dateTaken,
      // Result fields
      fbs: entity.fbs,
      bun: entity.bun,
      creatinine: entity.creatinine,
      uric_acid: entity.uricAcid,
      cholesterol: entity.cholesterol,
      triglycerides: entity.triglycerides,
      hdl: entity.hdl,
      ldl: entity.ldl,
      vldl: entity.vldl,
      sodium: entity.sodium,
      potassium: entity.potassium,
      chloride: entity.chloride,
      calcium: entity.calcium,
      sgot: entity.sgot,
      sgpt: entity.sgpt,
      rbs: entity.rbs,
      alk_phosphatase: entity.alkPhosphatase,
      total_protein: entity.totalProtein,
      albumin: entity.albumin,
      globulin: entity.globulin,
      ag_ratio: entity.agRatio,
      total_bilirubin: entity.totalBilirubin,
      direct_bilirubin: entity.directBilirubin,
      indirect_bilirubin: entity.indirectBilirubin,
      ionised_calcium: entity.ionisedCalcium,
      magnesium: entity.magnesium,
      hbalc: entity.hbalc,
      ogtt_30min: entity.ogtt30min,
      ogtt_1hr: entity.ogtt1hr,
      ogtt_2hr: entity.ogtt2hr,
      ppbs_2hr: entity.ppbs2hr,
      inor_phosphorus: entity.inorPhosphorus,
    });
  }
}