'use strict';

import User from '../user/user.model.js';
import Pet from './pet.model.js';

// Controlador para guardar una nueva mascota
export const savePet = async (req, res) => {
    // Obtener los datos del cuerpo de la solicitud
    const data = req.body;
    
    // Buscar al usuario propietario por su correo
    const user = await User.findOne({ correo: data.correo });
    
    // Verificar si el usuario propietario existe
    if (!user) return res.status(404).send({ message: 'Propietario no encontrado' });

    // Crear una nueva instancia de Pet con los datos y el propietario
    const pet = new Pet({
        ...data,
        keeper: user._id,
    });

    // Guardar la mascota en la base de datos
    await pet.save();

    // Responder con la mascota guardada
    res.status(200).json({
        pet
    });
}

// Controlador para obtener la lista de mascotas con nombres de propietarios
export const getPets = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { status: true };

    try {
        // Obtener la lista de mascotas paginada
        const pets = await Pet.find(query)
            .skip(Number(desde))
            .limit(Number(limite));

        // Obtener la lista de mascotas con nombres de propietarios
        const petsWithOwnerNames = await Promise.all(pets.map(async (pet) => {
            const owner = await User.findById(pet.keeper);
            return {
                ...pet.toObject(),
                keeper: owner ? owner.nombre : "Propietario no encontrado",
            };
        }));

        // Obtener el total de mascotas
        const total = await Pet.countDocuments(query);

        // Responder con la lista de mascotas y su total
        res.status(200).json({
            total,
            pets: petsWithOwnerNames,
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Controlador para buscar una mascota por su ID
export const searchPet = async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar la mascota por su ID
        const pet = await Pet.findById(id);
        
        // Verificar si la mascota existe
        if (!pet) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
        }

        // Obtener al propietario de la mascota
        const owner = await User.findById(pet.keeper);

        // Responder con la información de la mascota y su propietario
        res.status(200).json({
            pet: {
                ...pet.toObject(),
                keeper: owner ? owner.nombre : "Propietario no encontrado",
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Controlador para eliminar una mascota por su ID
export const deletePet = async (req, res) => {
    const { id } = req.params;

    // Actualizar el estado de la mascota a 'false' para simular su eliminación
    await Pet.findByIdAndUpdate(id, { status: false });

    // Responder con un mensaje de éxito
    res.status(200).json({ msg: 'Pet eliminada exitosamente' });
}
