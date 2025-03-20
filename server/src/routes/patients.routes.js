import express from 'express';
import { getPatients, addPatient, getPatientById } from '../controllers/patients.controllers.js';

const router = express.Router();

router.get('/', getPatients);

router.get('/:id', getPatientById); 

router.post('/add-patient', addPatient);

export default router;
