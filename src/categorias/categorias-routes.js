import { Router } from 'express';
import { check } from "express-validator";
import { saveCategoria, getCategorias, deleteCategorias, updateCategoria } from './categorias-controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { onlyAdmin } from '../middlewares/validar-usuarios.js';

const router = Router();

router.post(
    '/',
    [
        validarJWT,
        onlyAdmin,
        validarCampos
    ],
    saveCategoria
)

router.get('/', getCategorias)

router.delete(
    '/:id',
    [
        validarJWT,
        onlyAdmin,
        validarCampos
    ],
    deleteCategorias
)

router.put(
    '/:id',
    [
        validarJWT,
        onlyAdmin,
        validarCampos
    ],
    updateCategoria
)

export default router;