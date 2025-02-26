import Categoria from "./categorias-model.js";
import Publication from "../publication/publication-model.js";

export const saveCategoria = async(req, res) => {
    try{
        const data = req.body;

        const categoria = new Categoria({
            categoria: data.categoria
        })

        await categoria.save();

        res.status(200).json({
            success: true,
            categoria
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            msg: "Error al crear la categoria"
        })

    }
}

export const getCategorias = async(req, res) => {
    try {
        const query = { state: true};
        const categorias = await Categoria.find()

        const total = await Categoria.countDocuments(query);

        return res.status(200).json({
            success: true,
            msg: "Categorias obtenidas con exito",
            total,
            categorias
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener las categorias"
        })   
    }

}

export const deleteCategorias = async(req, res) => {
    const { id } = req.params;
    try{
        const categoriaEliminada = await Categoria.findById(id);
        const categoriaSocial = await Categoria.findOne({ categoria: "Social" });

        await Publication.updateMany(
            { categoria: categoriaEliminada._id },
            { categoria: categoriaSocial._id }
        );

        await Categoria.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            msg: "Categoria eliminada con exito!"
        })
    }catch(error){
        res.status(500).json({
            success: false,
            msg: "Error al eliminar la categoria",
            error: error.message || error
        })
    }
}

export const updateCategoria = async(req, res) => {
    try {
        const { id } = req.params;
        const { _id, categoria, ...data} = req.body;

        const catego = await Categoria.findByIdAndUpdate(id, data, {new: true});

        catego.categoria = categoria;
        await catego.save(); 

        res.status(200).json({
            success: true,
            msg: "Categoria actualizada",
            catego
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar la categoria",
            error: error.message || error
        })
    }
}