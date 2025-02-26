import Publication from "../publication/publication-model.js";
import Comentario from "./comentarios-model.js";
import User from "../users/user-model.js";

export const updateComent = async(req, res) => {
    try {
        const { id } = req.params;
        const { comentario } = req.body;
        const authenticatedUser = req.user.id;

        const publi = await Publication.findById(id);
        if (!publi) {
            return res.status(404).json({
                success: false,
                msg: "Publicación no encontrada"
            });
        }

        const newComment = await Comentario.create({
            comentario,
            titular: authenticatedUser
        });        

        publi.comentarios.push(newComment);

        
        await publi.save();

        
        const savedPubli = await Publication.findById(id)
            .populate({
                path: "comentarios",
                select: "titular comentario -_id",
                populate: {
                    path: "titular",
                    select: "username -_id"
                }
            })
            .populate("categoria", "categoria -_id")
            .populate("titular", "username -_id")

        res.status(200).json({
            success: true,
            msg: "Comentario agregado",
            publi: savedPubli
        })
        
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al subir el comentario"
        })
    }
}

export const editarComentario = async(req, res) => {
    try {
        const { id } = req.params;
        const { _id, comentario, ...data} = req.body;
        
        const comment = await Comentario.findByIdAndUpdate(id, data, {new: true})
            .populate("titular", "username -_id")

        comment.comentario = comentario;
        await comment.save()

        res.status(200).json({
            success: true,
            msg: "Comentario actualizado",
            comment
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar el comentario",
            error: error.message || error
        })
    }
}

export const deleteComment = async(req, res) => {
    const { id } = req.params;
    
    try {
        await Comentario.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            msg: "Comentario eliminado con exito!"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al eliminar el comentario",
            error: error.message || error
        })
    }
}
