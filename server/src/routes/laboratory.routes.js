import express from 'express';
import {
  saveBloodChemResults,  // ✅ This is the correct function name
  saveLabRequestForm,
  getLabRequests,
  updateLabRequestResults,
  getLabRequestById
} from '../controllers/laboratory.controller.js';

const router = express.Router();

router.post('/blood_chem', saveBloodChemResults);        // ✅ updated route
router.post('/lab_requests', saveLabRequestForm);
router.get('/lab_requests', getLabRequests);
router.put('/lab_requests/:patientId/:requestDate', updateLabRequestResults);
router.get("/lab_requests/:patientId", getLabRequestById);


export default router;

