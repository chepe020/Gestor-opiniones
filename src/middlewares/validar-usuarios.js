import User from '../users/user-model.js';
import Categoria from '../categorias/categorias-model.js';
import Comentario from '../comentarios/comentarios-model.js';
import argon2 from "argon2";

export const onlyOneStudent = async(req, res, next) => {
    const { id } = req.params;
    const authenticatedUser = req.user.id;

    try {
        if(authenticatedUser !== id){
            return res.status(403).json({
                success: false,
                msg: "Solo puede editar su perfil"
            })
        }
    
        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al modificar el usuario"
        })
    }
}

export const justEditAOneStudent = async(req, res, next) => {
    const { id } = req.params;
    const authenticatedUser = req.user.id;

    const comment = await Comentario.findById(id);

    if (!comment) {
        return res.status(404).json({
            success: false,
            msg: "El comentario no existe"
        });
    }
    
    try {
        if (comment.titular.toString() !== authenticatedUser) {
            return res.status(403).json({
                success: false,
                msg: "No tienes permiso para editar este comentario"
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al modificar el comentario",
            error: error.message || error
        })
    }
}

export const createAdminuser = async() => {
    try {
        const adminExists = await User.findOne({ role: "ADMIN_ROLE" });

        if(!adminExists){
            const hashedPassword = await argon2.hash("admin1234");

            const adminUser = new User({
                name: "Admin",
                surname: "User",
                username: "admin",
                email: "admin@gmail.com",
                password: hashedPassword,
                phone: "11223344",
                role: "ADMIN_ROLE",
                state: true
            });
    
            await adminUser.save();
            console.log("Usuario creado con exito")
        } else {
            console.log("ADMIN ya existente")
        }

        
    } catch (error) {
        console.log("Error al crear el usuario");
    }

}

export const createCategoria = async() => {
    try {
        const categoriaExists = await Categoria.findOne({categoria: "Social"});

        if(!categoriaExists){
            const categoriaDefault = new Categoria({
                categoria: "Social"
            });

            await categoriaDefault.save();
            console.log("Categoria creada con exito");
        }else{
            console.log(`Categoria ya existente`)
        }
    } catch (error) {
        console.log("Error al crear la categoria")
    }
}

export const onlyAdmin = async(req, res, next) => {
    try {
        const {id} = req.params;
        const authenticatedUserAdmin = req.user.role;
        
        if(authenticatedUserAdmin !== "ADMIN_ROLE"){
            return res.status(403).json({
                success: false,
                msg: "Solo el ADMIN puede modificar una categoria"
            })
        }

        next()
    } catch (error) {
        return res.json(500).json({
            success: false,
            msg: "Error al modificar la categoria",
            error: error.message || error
        })
    }
}