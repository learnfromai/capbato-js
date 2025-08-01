import { injectable } from 'tsyringe';
import { Schedule } from '@nx-starter/domain';
import type { IScheduleRepository } from '@nx-starter/domain';
import type { Specification } from '@nx-starter/domain';
import { ScheduleMapper } from '@nx-starter/application-shared';
import { ScheduleModel, IScheduleDocument } from './ScheduleSchema';

/**
 * Mongoose implementation of IScheduleRepository
 * Supports MongoDB via Mongoose ODM
 */
@injectable()
export class MongooseScheduleRepository implements IScheduleRepository {
  async getAll(): Promise<Schedule[]> {
    const documents = await ScheduleModel.find()
      .sort({ date: 1, time: 1 })
      .exec();
    return documents.map(this.toDomain);
  }

  async create(schedule: Schedule): Promise<string> {
    const document = new ScheduleModel({
      doctorName: schedule.doctorNameValue,
      date: schedule.dateString,
      time: schedule.timeValue,
      createdAt: schedule.createdAt,
    });

    const saved = await document.save();
    return saved._id.toString();
  }

  async update(id: string, changes: Partial<Schedule>): Promise<void> {
    const updateData: any = {};

    if (changes.doctorName) {
      updateData.doctorName = typeof changes.doctorName === 'string' 
        ? changes.doctorName 
        : changes.doctorName.value;
    }
    
    if (changes.date) {
      updateData.date = typeof changes.date === 'string'
        ? changes.date
        : changes.date.dateString;
    }
    
    if (changes.time) {
      updateData.time = typeof changes.time === 'string'
        ? changes.time
        : changes.time.value;
    }

    const result = await ScheduleModel.updateOne({ _id: id }, updateData);
    
    if (result.matchedCount === 0) {
      throw new Error(`Schedule with ID ${id} not found`);
    }
  }

  async delete(id: string): Promise<void> {
    const result = await ScheduleModel.deleteOne({ _id: id });
    
    if (result.deletedCount === 0) {
      throw new Error(`Schedule with ID ${id} not found`);
    }
  }

  async getById(id: string): Promise<Schedule | undefined> {
    const document = await ScheduleModel.findById(id).exec();
    return document ? this.toDomain(document) : undefined;
  }

  async getByDate(date: string): Promise<Schedule[]> {
    const documents = await ScheduleModel.find({ date })
      .sort({ time: 1 })
      .exec();
    return documents.map(this.toDomain);
  }

  async getTodaySchedules(): Promise<Schedule[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getByDate(today);
  }

  async getByDoctorName(doctorName: string): Promise<Schedule[]> {
    const documents = await ScheduleModel.find({
      doctorName: { $regex: doctorName, $options: 'i' }
    })
      .sort({ date: 1, time: 1 })
      .exec();
    return documents.map(this.toDomain);
  }

  async getByDateRange(startDate: string, endDate: string): Promise<Schedule[]> {
    const documents = await ScheduleModel.find({
      date: { $gte: startDate, $lte: endDate }
    })
      .sort({ date: 1, time: 1 })
      .exec();
    return documents.map(this.toDomain);
  }

  async findBySpecification(specification: Specification<Schedule>): Promise<Schedule[]> {
    const allSchedules = await this.getAll();
    return allSchedules.filter(schedule => specification.isSatisfiedBy(schedule));
  }

  async existsByDoctorNameAndDateTime(
    doctorName: string,
    date: string,
    time: string
  ): Promise<boolean> {
    const count = await ScheduleModel.countDocuments({
      doctorName,
      date,
      time,
    });
    return count > 0;
  }

  private toDomain(document: IScheduleDocument): Schedule {
    return ScheduleMapper.fromPlainObject({
      id: document._id.toString(),
      doctorName: document.doctorName,
      date: document.date,
      time: document.time,
      createdAt: document.createdAt,
    });
  }
}