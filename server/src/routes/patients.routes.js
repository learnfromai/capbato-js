import express from 'express';
import { getPatients, addPatient, getPatientById } from '../controllers/patients.controllers.js';

const router = express.Router();

// Get all patients
router.get('/', getPatients);

// Get a specific patient by ID
router.get('/:id', getPatientById); // ✅ New route for fetching patient details

// Add a new patient
router.post('/add-patient', addPatient);

export default router;
