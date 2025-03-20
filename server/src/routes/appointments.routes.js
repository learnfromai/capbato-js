import express from 'express'
import {
  addAppointment,
  cancelAppointment,
  getAppointments,
} from '../controllers/appointments.controller.js'

const router = express.Router()

router.get('/', getAppointments)

router.post('/add', addAppointment)

router.put('/cancel/:id', cancelAppointment)

export default router

