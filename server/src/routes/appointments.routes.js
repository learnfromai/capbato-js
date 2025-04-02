import express from 'express'
import {
  addAppointment,
  cancelAppointment,
  getAppointments,
  updateAppointment,
  getTodayConfirmedAppointments,
  getTodayAppointments
} from '../controllers/appointments.controller.js'

const router = express.Router()

router.get('/', getAppointments)
router.post('/add', addAppointment)
router.put('/cancel/:id', cancelAppointment)
router.put('/update/:id', updateAppointment)
router.get('/today/confirmed', getTodayConfirmedAppointments);
router.get('/today', getTodayAppointments);

export default router
