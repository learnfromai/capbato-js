import express from 'express';
import {
  getPatients,
  getPatientById,
  addPatient,
  getTotalPatients,
  searchPatients
} from '../controllers/patients.controllers.js';

const router = express.Router();

router.get('/search', searchPatients);     // ✅ Put this BEFORE '/:id'
router.get('/total', getTotalPatients);
router.get('/', getPatients);
router.get('/:id', getPatientById);        // 🔻 Keep this last
router.post('/add-patient', addPatient);

export default router;
