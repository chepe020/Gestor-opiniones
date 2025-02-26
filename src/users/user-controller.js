import {response, request} from 'express';
import {hash} from 'argon2';
import User from './user-model.js';
import argon2 from 'argon2';

export const getUsers = async(req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { state: true };
        
        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener los usuarios",
            error
        })
    }
}

export const updateUsers = async(req, res) => {
    try {
        const { id } = req.params;
        const { _id, email, password, oldPassword, ...data} = req.body;
        const user = await User.findById(id);

        if (password) {
            if (!oldPassword) {
                return res.status(400).json({ 
                    success: false, 
                    msg: "Debes ingresar la contraseña actual" 
                });
            }

            const isMatch = await argon2.verify(user.password, oldPassword);
            if (!isMatch) {
                return res.status(401).json({ 
                    success: false, 
                    msg: "Contraseña actual incorrecta"
                });
            }

            data.password = await argon2.hash(password);
        }

        

        const updatedUser  = await User.findByIdAndUpdate(id, data, {new: true});
        
        res.status(200).json({
            success: true,
            msg: "Usuario actualizado con exito",
            user: updatedUser
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el usuario',
            error
        })
    }
}