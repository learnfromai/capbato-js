import { Schema, model, Document } from 'mongoose';

export interface IAppointmentDocument extends Document {
  _id: string;
  patientId: string;
  patientName: string;
  reasonForVisit: string;
  appointmentDate: Date;
  appointmentTime: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  contactNumber?: string;
  doctorName?: string;
  createdAt: Date;
  updatedAt?: Date;
}

const AppointmentSchema = new Schema<IAppointmentDocument>(
  {
    patientId: {
      type: String,
      required: true,
      trim: true,
    },
    patientName: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },
    reasonForVisit: {
      type: String,
      required: true,
      trim: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
      maxlength: 10,
      trim: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'cancelled', 'completed'],
      default: 'scheduled',
    },
    contactNumber: {
      type: String,
      maxlength: 15,
      trim: true,
      required: false,
    },
    doctorName: {
      type: String,
      maxlength: 100,
      trim: true,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: false, // We handle timestamps manually
    collection: 'appointments',
  }
);

// Create indexes for better query performance
AppointmentSchema.index({ appointmentDate: 1 });
AppointmentSchema.index({ patientId: 1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });

export const AppointmentModel = model<IAppointmentDocument>('Appointment', AppointmentSchema);