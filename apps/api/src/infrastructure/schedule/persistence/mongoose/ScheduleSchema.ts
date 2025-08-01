import { Schema, model, Document } from 'mongoose';

export interface IScheduleDocument extends Document {
  _id: string;
  doctorName: string;
  date: string;
  time: string;
  createdAt: Date;
}

const ScheduleSchema = new Schema<IScheduleDocument>(
  {
    doctorName: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD format
    },
    time: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/, // HH:MM format
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // We handle createdAt manually
    collection: 'schedules',
  }
);

// Create indexes for better query performance
ScheduleSchema.index({ date: 1, time: 1 });
ScheduleSchema.index({ doctorName: 1 });
ScheduleSchema.index({ date: 1 });
ScheduleSchema.index({ createdAt: -1 });

// Compound index for uniqueness check
ScheduleSchema.index({ doctorName: 1, date: 1, time: 1 }, { unique: true });

export const ScheduleModel = model<IScheduleDocument>('Schedule', ScheduleSchema);