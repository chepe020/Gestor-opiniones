import {Schema, model} from 'mongoose';


const PublicationSchema = Schema({
    titular: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    titulo: {
        type: String,
        required: [true, "El titulo es obligatorio"]
    },
    categoria: [{
        type: Schema.Types.ObjectId,
        ref: "Categoria",
        required: [true, "La categoria es obligatoria"]
    }],
    texto: {
        type: String,
        required: [true, "El texto es obligatorio"]
    },
    comentarios: [{
        type: Schema.Types.ObjectId,
        ref: 'Comentario'
    }],
    state: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true,
    versionKey: false
});

export default model('Publication', PublicationSchema)