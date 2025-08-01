import { injectable } from 'tsyringe';
import mongoose from 'mongoose';
import { Schedule, ScheduleId } from '@nx-starter/domain';
import type { IScheduleRepository } from '@nx-starter/domain';
import { ScheduleModel, IScheduleDocument } from './ScheduleSchema';

/**
 * Mongoose implementation of IScheduleRepository
 * For MongoDB NoSQL database
 */
@injectable()
export class MongooseScheduleRepository implements IScheduleRepository {
  async getAll(activeOnly?: boolean): Promise<Schedule[]> {
    let query = ScheduleModel.find();
    
    if (activeOnly) {
      const today = new Date().toISOString().split('T')[0];
      query = query.where('date').gte(today);
    }
    
    const documents = await query
      .sort({ date: 1, time: 1 })
      .lean()
      .exec();

    return documents.map(this.toDomain);
  }

  async create(schedule: Schedule): Promise<Schedule> {
    const document = new ScheduleModel({
      doctorName: schedule.doctorName,
      date: schedule.dateString,
      time: schedule.timeString,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    });

    const saved = await document.save();
    
    // Return the created schedule with the MongoDB ID
    return new Schedule(
      schedule.doctorName,
      schedule.date,
      schedule.time,
      saved._id.toString(),
      schedule.createdAt,
      schedule.updatedAt
    );
  }

  async getById(id: ScheduleId): Promise<Schedule | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id.value)) {
      return undefined;
    }

    const document = await ScheduleModel.findById(id.value).lean().exec();
    return document ? this.toDomain(document) : undefined;
  }

  async getByDate(date: string): Promise<Schedule[]> {
    const documents = await ScheduleModel.find({ date })
      .sort({ time: 1 })
      .lean()
      .exec();

    return documents.map(this.toDomain);
  }

  async getByDoctorName(doctorName: string): Promise<Schedule[]> {
    const documents = await ScheduleModel.find({
      doctorName: { $regex: doctorName, $options: 'i' }
    })
      .sort({ date: 1, time: 1 })
      .lean()
      .exec();

    return documents.map(this.toDomain);
  }

  async getTodaySchedules(): Promise<Schedule[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getByDate(today);
  }

  async getTodayFirstDoctor(): Promise<Schedule | undefined> {
    const today = new Date().toISOString().split('T')[0];
    const document = await ScheduleModel.findOne({ date: today })
      .sort({ time: 1 })
      .lean()
      .exec();

    return document ? this.toDomain(document) : undefined;
  }

  async update(schedule: Schedule): Promise<Schedule> {
    if (!schedule.id) {
      throw new Error('Cannot update schedule without ID');
    }

    if (!mongoose.Types.ObjectId.isValid(schedule.id.value)) {
      throw new Error(`Schedule with ID ${schedule.id.value} not found`);
    }

    const updateData = {
      doctorName: schedule.doctorName,
      date: schedule.dateString,
      time: schedule.timeString,
      updatedAt: new Date(),
    };

    const document = await ScheduleModel.findByIdAndUpdate(
      schedule.id.value,
      updateData,
      { new: true, lean: true }
    ).exec();

    if (!document) {
      throw new Error(`Schedule with ID ${schedule.id.value} not found`);
    }

    return this.toDomain(document);
  }

  async delete(id: ScheduleId): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id.value)) {
      return false;
    }

    const result = await ScheduleModel.deleteOne({ _id: id.value }).exec();
    return result.deletedCount > 0;
  }

  async exists(id: ScheduleId): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id.value)) {
      return false;
    }

    const count = await ScheduleModel.countDocuments({ _id: id.value }).exec();
    return count > 0;
  }

  async findConflicts(schedule: Schedule): Promise<Schedule[]> {
    let query: any = {
      doctorName: { $regex: `^${schedule.doctorName}$`, $options: 'i' },
      date: schedule.dateString,
    };

    // If schedule has an ID, exclude it from conflicts
    if (schedule.id && mongoose.Types.ObjectId.isValid(schedule.id.value)) {
      query._id = { $ne: schedule.id.value };
    }

    const documents = await ScheduleModel.find(query).lean().exec();
    const allSchedules = documents.map(this.toDomain);
    
    // Filter using domain logic for time conflicts
    return allSchedules.filter(existingSchedule => 
      schedule.conflictsWith(existingSchedule)
    );
  }

  async getStats(): Promise<{
    total: number;
    today: number;
    upcoming: number;
    uniqueDoctors: number;
  }> {
    const today = new Date().toISOString().split('T')[0];
    
    const [total, todayCount, upcoming, uniqueDoctorsResult] = await Promise.all([
      ScheduleModel.countDocuments().exec(),
      ScheduleModel.countDocuments({ date: today }).exec(),
      ScheduleModel.countDocuments({ date: { $gte: today } }).exec(),
      ScheduleModel.aggregate([
        {
          $group: {
            _id: { $toLower: '$doctorName' }
          }
        },
        {
          $count: 'count'
        }
      ]).exec()
    ]);

    return {
      total,
      today: todayCount,
      upcoming,
      uniqueDoctors: uniqueDoctorsResult[0]?.count || 0,
    };
  }

  /**
   * Convert MongoDB document to domain entity
   */
  private toDomain(document: any): Schedule {
    return new Schedule(
      document.doctorName,
      document.date,
      document.time,
      document._id.toString(),
      new Date(document.createdAt),
      document.updatedAt ? new Date(document.updatedAt) : undefined
    );
  }

  /**
   * Convert domain entity to MongoDB document (for testing/seeding)
   */
  toDocument(schedule: Schedule): Partial<IScheduleDocument> {
    return {
      _id: schedule.stringId as any,
      doctorName: schedule.doctorName,
      date: schedule.dateString,
      time: schedule.timeString,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    };
  }

  // Utility methods for testing
  async clear(): Promise<void> {
    await ScheduleModel.deleteMany({}).exec();
  }

  async seed(schedules: Schedule[]): Promise<void> {
    const documents = schedules.map(schedule => ({
      doctorName: schedule.doctorName,
      date: schedule.dateString,
      time: schedule.timeString,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    }));

    await ScheduleModel.insertMany(documents);
  }
}