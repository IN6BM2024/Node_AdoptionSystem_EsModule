import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import User from './user.model.js';

// Obtiene la lista de usuarios paginada y con estado activo
export const getUsers = async (req = request, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);

    res.status(200).json({
        total,
        users,
    });
}

// Crea un nuevo usuario en la base de datos
export const createUser = async (req, res) => {
    const { nombre, correo, password, role, phone } = req.body;
    const user = new User({ nombre, correo, password, role, phone });

    // Verifica si el correo ya existe en la base de datos

    // Encripta la contraseña
    const salt = bcryptjs.genSaltSync(); // Por defecto tiene 10 vueltas
    user.password = bcryptjs.hashSync(password, salt);

    // Guarda los datos del nuevo usuario
    await user.save();

    res.status(200).json({
        user,
    });
}

// Obtiene un usuario por su ID
export const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });

    res.status(200).json({
        user,
    });
}

// Actualiza la información de un usuario
export const updateUser = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...data} = req.body;

    if (password) {
        // Si se proporciona una nueva contraseña, la encripta antes de actualizar
        const salt = bcryptjs.genSaltSync(); // Por defecto tiene 10 vueltas
        data.password = bcryptjs.hashSync(password, salt);
    }

    // Actualiza el usuario en la base de datos
    await User.findByIdAndUpdate(id, data);

    // Obtiene el usuario actualizado
    const user = await User.findOne({ _id: id });

    res.status(200).json({
        msg: 'Usuario Actualizado',
        user,
    });
}

// Desactiva un usuario en la base de datos
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    // Desactiva el usuario en lugar de borrarlo permanentemente
    const user = await User.findByIdAndUpdate(id, { estado: false });

    // Obtiene el usuario autenticado que realiza la acción
    const authenticatedUser = req.user;

    res.status(200).json({ msg: 'Usuario desactivado', user, authenticatedUser });
}
