import express from 'express'
import {
  addAppointment,
  cancelAppointment,
  getAppointments,
} from '../controllers/appointments.controller.js'

const router = express.Router()

// ✅ Route to Fetch All Appointments
router.get('/', getAppointments)

// ✅ Route to Add an Appointment
router.post('/add', addAppointment)

router.put('/cancel/:id', cancelAppointment)

export default router

