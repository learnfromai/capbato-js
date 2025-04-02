import express from 'express';
import {
  getPatients,
  addPatient,
  getPatientById,
  getTotalPatients  // ✅ Add this
} from '../controllers/patients.controllers.js';

const router = express.Router();

router.get('/', getPatients);
router.get('/:id', getPatientById);
router.post('/add-patient', addPatient);
router.get('/total/count', getTotalPatients); // ✅ Dashboard route

export default router;
