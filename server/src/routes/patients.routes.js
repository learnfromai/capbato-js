import express from 'express'
import { getPatients, addPatient } from '../controllers/patients.controllers.js'

const router = express.Router()

router.get('/', getPatients)
router.post('/add-patient', addPatient)

export default router
