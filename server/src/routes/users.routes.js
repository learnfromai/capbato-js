import express from 'express';
import { getAllUsers, createUser, changeUserPassword } from '../controllers/users.controller.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id/password', changeUserPassword);

export default router;
