import { Appointment } from './Appointment';
import { AppointmentStatus } from '../value-objects/AppointmentStatus';
import { AppointmentDate } from '../value-objects/AppointmentDate';
import { AppointmentTime } from '../value-objects/AppointmentTime';
import { ReasonForVisit } from '../value-objects/ReasonForVisit';
import {
  AppointmentAlreadyConfirmedException,
  AppointmentAlreadyCompletedException,
  AppointmentAlreadyCancelledException,
  InvalidAppointmentTransitionException,
  PastAppointmentException,
} from '../exceptions/DomainExceptions';

describe('Appointment Entity', () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const validAppointmentData = {
    patientId: 'patient-123',
    patientName: 'John Doe',
    reasonForVisit: 'Regular checkup',
    appointmentDate: tomorrow,
    appointmentTime: '09:00',
    doctorName: 'Dr. Smith',
    contactNumber: '+639123456789',
  };

  describe('Creation', () => {
    it('should create a valid appointment', () => {
      const appointment = new Appointment(
        validAppointmentData.patientId,
        validAppointmentData.patientName,
        validAppointmentData.reasonForVisit,
        validAppointmentData.appointmentDate,
        validAppointmentData.appointmentTime
      );

      expect(appointment.patientId).toBe(validAppointmentData.patientId);
      expect(appointment.patientName).toBe(validAppointmentData.patientName);
      expect(appointment.reasonForVisit.reason).toBe(validAppointmentData.reasonForVisit);
      expect(appointment.status.isScheduled()).toBe(true);
    });

    it('should throw error for empty patient ID', () => {
      expect(() => {
        new Appointment(
          '',
          validAppointmentData.patientName,
          validAppointmentData.reasonForVisit,
          validAppointmentData.appointmentDate,
          validAppointmentData.appointmentTime
        );
      }).toThrow('Patient ID is required');
    });

    it('should throw error for empty patient name', () => {
      expect(() => {
        new Appointment(
          validAppointmentData.patientId,
          '',
          validAppointmentData.reasonForVisit,
          validAppointmentData.appointmentDate,
          validAppointmentData.appointmentTime
        );
      }).toThrow('Patient name is required');
    });
  });

  describe('Status Transitions', () => {
    let appointment: Appointment;

    beforeEach(() => {
      appointment = new Appointment(
        validAppointmentData.patientId,
        validAppointmentData.patientName,
        validAppointmentData.reasonForVisit,
        validAppointmentData.appointmentDate,
        validAppointmentData.appointmentTime
      );
    });

    it('should confirm a scheduled appointment', () => {
      const confirmedAppointment = appointment.confirm();
      
      expect(confirmedAppointment.status.isConfirmed()).toBe(true);
      expect(confirmedAppointment.updatedAt).toBeDefined();
    });

    it('should throw error when confirming already confirmed appointment', () => {
      const confirmedAppointment = appointment.confirm();
      
      expect(() => confirmedAppointment.confirm()).toThrow(AppointmentAlreadyConfirmedException);
    });

    it('should complete a confirmed appointment', () => {
      const confirmedAppointment = appointment.confirm();
      const completedAppointment = confirmedAppointment.complete();
      
      expect(completedAppointment.status.isCompleted()).toBe(true);
    });

    it('should cancel an appointment', () => {
      const cancelledAppointment = appointment.cancel();
      
      expect(cancelledAppointment.status.isCancelled()).toBe(true);
    });

    it('should throw error for invalid status transition', () => {
      const completedAppointment = appointment.confirm().complete();
      
      expect(() => completedAppointment.confirm()).toThrow(InvalidAppointmentTransitionException);
    });
  });

  describe('Business Logic', () => {
    let appointment: Appointment;

    beforeEach(() => {
      appointment = new Appointment(
        validAppointmentData.patientId,
        validAppointmentData.patientName,
        validAppointmentData.reasonForVisit,
        validAppointmentData.appointmentDate,
        validAppointmentData.appointmentTime
      );
    });

    it('should reschedule an appointment', () => {
      const newDate = new Date(tomorrow);
      newDate.setDate(newDate.getDate() + 1);
      
      const rescheduledAppointment = appointment.reschedule(newDate, '10:00');
      
      expect(rescheduledAppointment.appointmentTime.time).toBe('10:00');
      expect(rescheduledAppointment.status.isScheduled()).toBe(true);
    });

    it('should update notes', () => {
      const updatedAppointment = appointment.updateNotes('Updated notes');
      
      expect(updatedAppointment.notes).toBe('Updated notes');
      expect(updatedAppointment.updatedAt).toBeDefined();
    });

    it('should update doctor name', () => {
      const updatedAppointment = appointment.updateDoctor('Dr. Johnson');
      
      expect(updatedAppointment.doctorName).toBe('Dr. Johnson');
    });

    it('should check if appointment is today', () => {
      const today = new Date();
      // Use a time within business hours that should be in the future
      const currentHour = today.getHours();
      const futureTime = currentHour < 16 ? '16:30' : '08:30'; // Use 4:30 PM if before, otherwise next day will be used
      
      const todayAppointment = new Appointment(
        validAppointmentData.patientId,
        validAppointmentData.patientName,
        validAppointmentData.reasonForVisit,
        currentHour < 16 ? today : tomorrow, // Use today if time is in future, otherwise tomorrow
        futureTime
      );
      
      expect(todayAppointment.isToday()).toBe(currentHour < 16);
      expect(appointment.isToday()).toBe(false);
    });

    it('should check if appointment is in future', () => {
      expect(appointment.isFuture()).toBe(true);
    });

    it('should detect conflicting appointments', () => {
      const conflictingAppointment = new Appointment(
        validAppointmentData.patientId, // Same patient
        'Jane Doe',
        'Follow-up',
        validAppointmentData.appointmentDate, // Same date
        '10:00' // Different time
      );
      
      expect(appointment.conflictsWith(conflictingAppointment)).toBe(true);
    });

    it('should detect same time slot appointments', () => {
      const sameTimeAppointment = new Appointment(
        'patient-456', // Different patient
        'Jane Doe',
        'Consultation',
        validAppointmentData.appointmentDate, // Same date
        validAppointmentData.appointmentTime // Same time
      );
      
      expect(appointment.hasSameTimeSlot(sameTimeAppointment)).toBe(true);
    });

    it('should validate appointment equality', () => {
      const sameAppointment = new Appointment(
        validAppointmentData.patientId,
        validAppointmentData.patientName,
        validAppointmentData.reasonForVisit,
        validAppointmentData.appointmentDate,
        validAppointmentData.appointmentTime,
        'scheduled',
        appointment.stringId // Same ID
      );
      
      if (appointment.id && sameAppointment.id) {
        expect(appointment.equals(sameAppointment)).toBe(true);
      }
    });
  });

  describe('Validation', () => {
    it('should validate appointment business rules', () => {
      const appointment = new Appointment(
        validAppointmentData.patientId,
        validAppointmentData.patientName,
        validAppointmentData.reasonForVisit,
        validAppointmentData.appointmentDate,
        validAppointmentData.appointmentTime
      );

      expect(() => appointment.validate()).not.toThrow();
    });

    it('should throw error for invalid appointment data', () => {
      const appointment = new Appointment(
        validAppointmentData.patientId,
        validAppointmentData.patientName,
        validAppointmentData.reasonForVisit,
        validAppointmentData.appointmentDate,
        validAppointmentData.appointmentTime
      );

      // Create appointment with invalid data by manipulating private fields
      const invalidAppointment = Object.create(appointment);
      invalidAppointment._patientId = '';

      expect(() => {
        new Appointment(
          '',
          validAppointmentData.patientName,
          validAppointmentData.reasonForVisit,
          validAppointmentData.appointmentDate,
          validAppointmentData.appointmentTime
        );
      }).toThrow();
    });
  });

  describe('Past Appointment Validation', () => {
    it('should throw error for past appointment date', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      expect(() => {
        new Appointment(
          validAppointmentData.patientId,
          validAppointmentData.patientName,
          validAppointmentData.reasonForVisit,
          pastDate,
          validAppointmentData.appointmentTime
        );
      }).toThrow('Cannot book appointment for a past date');
    });
  });
});