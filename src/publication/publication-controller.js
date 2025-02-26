import Publication from './publication-model.js';
import Categoria from '../categorias/categorias-model.js';

export const savePublication = async(req, res) => {
    try {
        console.log("Body recibido:", req.body);

        const data = req.body;
        const categoria = await Categoria.findOne({ categoria: data.categoria} );
        const titular = req.user.id;

        console.log("Categoría encontrada:", categoria);
        
        if(!categoria){
            return res.status(404).json({
                success: false,
                msg: "Property not found"
            })
        } 

        const publication = new Publication({
            ...data,
            categoria: categoria._id,
            titular: titular
        })

        await publication.save();

        const savedTitular = await Publication.findById(publication._id)
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
            publication: savedTitular
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al subir la publicacion",
            error
        })
    }
}

export const getPublications = async(req = request, res = response) => {
    const { limit = 10, desde = 0 } = req.query;
    const query = { state: true };

    try {
        const [total, publications] = await Promise.all([
            Publication.countDocuments(query),
            Publication.find(query)
                .skip(Number(desde))
                .limit(Number(limit))
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
        ])

        return res.status(200).json({
            success: true,
            msg: "Publicaciones obtenidas con exito",
            total,
            publications
        })
    } catch (error) {
        console.error("Error al obtener publicaciones:", error);
        return res.status(500).json({
            success: false,
            msg: "Error al obtener las publicaciones",
            error: error.message || error
        })
    }
}

export const eliminarPubli = async(req, res) => {
    try {
        const { id } = req.params;

        await Publication.findByIdAndUpdate(id, { state: false })
        
        
        const publi = await Publication.findById(id)
        .populate({
            path: "comentarios",
            select: "titular comentario -_id",
            populate: {
                path: "titular",
                select: "username -_id"
            }
        })
        .populate("categoria", "categoria -_id")
        .populate("titular", "username -_id");

        if (!publi) {
            return res.status(404).json({
                success: false,
                msg: "Publicación no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Publicacion eliminada",
            publi
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al eliminar la publicacion"
        })
    }
}

export const updatePubli = async(req, res) => {
    try {
        const { id } = req.params;
        const { _id, categoria, ...data } = req.body;

        const categoriaString = Array.isArray(categoria) ? categoria[0] : categoria;

        const categorias = await Categoria.findOne({ categoria: categoriaString });

        if (!categorias) {
            return res.status(404).json({ 
                success: false, 
                msg: "Categoría no encontrada" 
            });
        }

        data.categoria = categorias._id;

        const publi = await Publication.findByIdAndUpdate(id, data, {new: true})
        .populate({
            path: "comentarios",
            select: "titular comentario -_id",
            populate: {
                path: "titular",
                select: "username -_id"
            }
        })
        .populate("categoria", "categoria -_id")
        .populate("titular", "username -_id");

        res.status(200).json({
            success: true,
            msg: "Publicacion actualizada",
            publi
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar la publicacioN",
            error: error.message || error
        })
    }
}