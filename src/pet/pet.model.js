import { Schema, model } from "mongoose";

// Definición del esquema para la colección de mascotas
const PetSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        uppercase: true,
        required: true
    },
    keeper: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
}, {
    versionKey: false // Deshabilita la versión del documento
});

// Crear y exportar el modelo de mascota utilizando el esquema definido
export default model('Pet', PetSchema);
