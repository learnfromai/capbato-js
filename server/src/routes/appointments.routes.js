import express from 'express';
import { getAppointments } from '../controllers/appointments.controller.js';

const router = express.Router();

// Route to fetch all appointments
router.get('/', getAppointments);

export default router;
