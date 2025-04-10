import express from 'express';
import {
  addAppointment,
  cancelAppointment,
  getAppointments,
  updateAppointment,
  getTodayConfirmedAppointments,
  getTodayAppointments,
  getAppointmentsByPatientId
} from '../controllers/appointments.controller.js';

const router = express.Router();

// Route to fetch all appointments for a specific patient
router.get('/patient/:id', getAppointmentsByPatientId);

// Main appointments routes
router.get('/', getAppointments);
router.post('/add', addAppointment);
router.put('/cancel/:id', cancelAppointment);
router.put('/update/:id', updateAppointment);
router.get('/today/confirmed', getTodayConfirmedAppointments);
router.get('/today', getTodayAppointments);
router.get('/patient/:id', getAppointmentsByPatientId);


export default router;
