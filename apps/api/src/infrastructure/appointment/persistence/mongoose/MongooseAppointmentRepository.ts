import { injectable } from 'tsyringe';
import mongoose from 'mongoose';
import { Appointment } from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';
import { AppointmentModel, type IAppointmentDocument } from './AppointmentSchema';

/**
 * Mongoose implementation of IAppointmentRepository
 * For MongoDB NoSQL database
 */
@injectable()
export class MongooseAppointmentRepository implements IAppointmentRepository {
  async getAll(): Promise<Appointment[]> {
    const documents = await AppointmentModel.find()
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .lean()
      .exec();

    return documents.map(this.toDomain);
  }

  async create(appointment: Appointment): Promise<string> {
    const document = new AppointmentModel({
      patientId: appointment.patientId,
      patientName: appointment.patientName.value,
      reasonForVisit: appointment.reasonForVisit.value,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      status: appointment.status.value,
      contactNumber: appointment.contactNumber?.value,
      doctorName: appointment.doctorName?.value,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    });

    const saved = await document.save();
    return saved._id.toString();
  }

  async update(id: string, appointment: Appointment): Promise<void> {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`Appointment with ID ${id} not found`);
    }

    const updateData = {
      patientName: appointment.patientName.value,
      reasonForVisit: appointment.reasonForVisit.value,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      status: appointment.status.value,
      contactNumber: appointment.contactNumber?.value,
      doctorName: appointment.doctorName?.value,
      updatedAt: new Date(),
    };

    const result = await AppointmentModel.updateOne({ _id: id }, updateData).exec();

    if (result.matchedCount === 0) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
  }

  async delete(id: string): Promise<void> {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`Appointment with ID ${id} not found`);
    }

    const result = await AppointmentModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
  }

  async getById(id: string): Promise<Appointment | undefined> {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return undefined;
    }

    const document = await AppointmentModel.findById(id).lean().exec();
    return document ? this.toDomain(document) : undefined;
  }

  async getByPatientId(patientId: string): Promise<Appointment[]> {
    const documents = await AppointmentModel.find({ patientId })
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .lean()
      .exec();

    return documents.map(this.toDomain);
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const documents = await AppointmentModel.find({
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .sort({ appointmentTime: 1 })
      .lean()
      .exec();

    return documents.map(this.toDomain);
  }

  async getTodayConfirmedAppointments(): Promise<Appointment[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const documents = await AppointmentModel.find({
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: 'confirmed',
    })
      .sort({ appointmentTime: 1 })
      .lean()
      .exec();

    return documents.map(this.toDomain);
  }

  async getWeeklyAppointmentSummary(): Promise<{ date: string; count: number }[]> {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Saturday)

    const results = await AppointmentModel.aggregate([
      {
        $match: {
          appointmentDate: {
            $gte: startOfWeek,
            $lte: endOfWeek,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$appointmentDate',
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    return results;
  }

  /**
   * Convert MongoDB document to domain object
   */
  private toDomain(document: IAppointmentDocument): Appointment {
    return new Appointment(
      document.patientId,
      document.patientName,
      document.reasonForVisit,
      document.appointmentDate,
      document.appointmentTime,
      document.status,
      document.createdAt,
      document._id.toString(),
      document.contactNumber,
      document.doctorName,
      document.updatedAt
    );
  }
}