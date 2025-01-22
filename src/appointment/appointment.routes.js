import { Router } from 'express';
import { validarCampos } from '../middlewares/validar-campos.js';
import { saveAppointment, showAppointments } from './appointment.controller.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

// Ruta para crear una nueva cita
router.post('/', [validarJWT, validarCampos], saveAppointment);
router.get('/',[validarJWT,validarCampos],showAppointments);

export default router;

