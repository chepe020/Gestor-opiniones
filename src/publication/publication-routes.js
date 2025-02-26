import { Router } from 'express';
import { check } from 'express-validator';
import { savePublication, getPublications, eliminarPubli, updatePubli } from './publication-controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from "../middlewares/validar-jwt.js";
import { eliminarPublicacion, editarPublicacion } from '../middlewares/validar-publicaciones.js';

const router = Router();

router.post(
    '/submit',
    [
        validarJWT,
        validarCampos
    ],
    savePublication
)

router.get(
    '/',
    [
        validarCampos
    ],
    getPublications
)

router.delete(
    '/:id',
    [
        validarJWT,
        eliminarPublicacion,
        validarCampos
    ],
    eliminarPubli
)

router.put(
    '/:id',
    [
        validarJWT,
        editarPublicacion,
        validarCampos
    ],
    updatePubli
)

export default router;