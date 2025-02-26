import {Schema, model} from 'mongoose';

const CategoriaSchema = Schema({
    categoria: {
        type: String,
        required: true
    },
    state: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true,
    versionKey: false
});

export default model('Categoria', CategoriaSchema);