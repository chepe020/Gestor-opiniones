import Publication from './publication-model.js';
import Categoria from '../categorias/categorias-model.js';

export const savePublication = async (req, res) => {
    try {
        console.log("Body recibido:", req.body);
        
        const { categoria, ...data } = req.body;
        const categoriaEncontrada = await Categoria.findOne({ categoria });
        const titular = req.user.id;

        if (!categoriaEncontrada) {
            return res.status(404).json({ success: false, msg: "Property not found" });
        }

        const publication = new Publication({
            ...data,
            categoria: categoriaEncontrada._id,
            titular
        });

        await publication.save();
        
        const savedTitular = await Publication.findById(publication._id)
            .populate({
                path: "comentarios",
                select: "titular comentario -_id",
                populate: { path: "titular", select: "username -_id" }
            })
            .populate("categoria", "categoria -_id")
            .populate("titular", "username -_id");

        return res.status(200).json({ success: true, publication: savedTitular });
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Error al subir la publicación", error });
    }
};

export const getPublications = async (req = request, res = response) => {
    try {
        const { limit = 10, desde = 0 } = req.query;
        const query = { state: true };

        const [total, publications] = await Promise.all([
            Publication.countDocuments(query),
            Publication.find(query)
                .skip(Number(desde))
                .limit(Number(limit))
                .populate({
                    path: "comentarios",
                    select: "titular comentario -_id",
                    populate: { path: "titular", select: "username -_id" }
                })
                .populate("categoria", "categoria -_id")
                .populate("titular", "username -_id")
        ]);

        return res.status(200).json({ success: true, msg: "Publicaciones obtenidas con éxito", total, publications });
    } catch (error) {
        console.error("Error al obtener publicaciones:", error);
        return res.status(500).json({ success: false, msg: "Error al obtener las publicaciones", error });
    }
};

export const eliminarPubli = async (req, res) => {
    try {
        const { id } = req.params;
        
        const publi = await Publication.findByIdAndUpdate(id, { state: false }, { new: true })
            .populate({
                path: "comentarios",
                select: "titular comentario -_id",
                populate: { path: "titular", select: "username -_id" }
            })
            .populate("categoria", "categoria -_id")
            .populate("titular", "username -_id");
        
        if (!publi) {
            return res.status(404).json({ success: false, msg: "Publicación no encontrada" });
        }

        return res.status(200).json({ success: true, msg: "Publicación eliminada", publi });
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Error al eliminar la publicación", error });
    }
};

export const updatePubli = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, categoria, ...data } = req.body;
        
        const categoriaString = Array.isArray(categoria) ? categoria[0] : categoria;
        const categoriaEncontrada = await Categoria.findOne({ categoria: categoriaString });

        if (!categoriaEncontrada) {
            return res.status(404).json({ success: false, msg: "Categoría no encontrada" });
        }

        data.categoria = categoriaEncontrada._id;

        const publi = await Publication.findByIdAndUpdate(id, data, { new: true })
            .populate({
                path: "comentarios",
                select: "titular comentario -_id",
                populate: { path: "titular", select: "username -_id" }
            })
            .populate("categoria", "categoria -_id")
            .populate("titular", "username -_id");

        return res.status(200).json({ success: true, msg: "Publicación actualizada", publi });
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Error al actualizar la publicación", error });
    }
};
