import Categoria from "./categorias-model.js";
import Publication from "../publication/publication-model.js";

export const saveCategoria = async (req, res) => {
    try {
        const { categoria } = req.body;

        const newCategoria = new Categoria({
            categoria
        });

        await newCategoria.save();

        res.status(200).json({
            success: true,
            categoria: newCategoria
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al crear la categoría",
            error: error.message || error
        });
    }
};

export const getCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find({ state: true });
        const total = await Categoria.countDocuments({ state: true });

        res.status(200).json({
            success: true,
            msg: "Categorías obtenidas con éxito",
            total,
            categorias
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener las categorías",
            error: error.message || error
        });
    }
};

export const deleteCategorias = async (req, res) => {
    const { id } = req.params;

    try {
        const categoriaEliminada = await Categoria.findById(id);
        if (!categoriaEliminada) {
            return res.status(404).json({
                success: false,
                msg: "Categoría no encontrada"
            });
        }

        const categoriaSocial = await Categoria.findOne({ categoria: "Matematicas" });

        await Publication.updateMany(
            { categoria: categoriaEliminada._id },
            { categoria: categoriaSocial._id }
        );

        await Categoria.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            msg: "Categoría eliminada con éxito"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al eliminar la categoría",
            error: error.message || error
        });
    }
};

export const updateCategoria = async (req, res) => {
    const { id } = req.params;
    const { _id, categoria, ...data } = req.body;

    try {
        const updatedCategoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

        updatedCategoria.categoria = categoria;
        await updatedCategoria.save();

        res.status(200).json({
            success: true,
            msg: "Categoría actualizada",
            categoria: updatedCategoria
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar la categoría",
            error: error.message || error
        });
    }
};
