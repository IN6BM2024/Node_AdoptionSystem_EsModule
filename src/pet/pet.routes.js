import { Router } from "express";
import { check } from "express-validator";
import { deletePet, getPets, savePet, searchPet } from "./pet.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

// Crear un router para las rutas relacionadas con las mascotas
const router = Router();

// Ruta para guardar una nueva mascota
router.post('/',
    [
        validarJWT,
        check('correo', 'Este no es un correo válido').not().isEmpty(),
        validarCampos
    ], savePet);

// Ruta para obtener la lista de todas las mascotas
router.get('/', getPets);

// Ruta para buscar una mascota por su ID
router.get(
    '/:id',
    [
        validarJWT,
        validarCampos
    ], searchPet);

// Ruta para eliminar una mascota por su ID
router.delete('/:id', [validarJWT, validarCampos], deletePet);

// Exportar el router
export default router;
