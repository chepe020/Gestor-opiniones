import { Router } from 'express';
import { check } from 'express-validator';
import { updateComent, editarComentario, deleteComment } from '../comentarios/comentarios-controller.js'
import { justEditAOneStudent } from '../middlewares/validar-usuarios.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.put(
    '/:id',
    [
        validarJWT,
        validarCampos
    ],
    updateComent
)

router.put(
    '/editar/:id',
    [
        validarJWT,
        justEditAOneStudent,
        validarCampos
    ],
    editarComentario
)

router.delete(
    '/:id',
    [
        validarJWT,
        justEditAOneStudent,
        validarCampos
    ],
    deleteComment
)

export default router;