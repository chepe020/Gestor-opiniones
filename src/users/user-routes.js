import { Router } from "express";
import { check } from "express-validator";
import { getUsers, updateUsers } from './user-controller.js'
import { onlyOneStudent } from '../middlewares/validar-usuarios.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.get("/", getUsers)

router.put(
    '/:id',
    [
        validarJWT,
        onlyOneStudent,
        validarCampos
    ],
    updateUsers
)

export default router;
