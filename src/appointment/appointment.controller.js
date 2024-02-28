import Pet from '../pet/pet.model.js';
import Appointment from '../appointment/appointment.model.js';

export const saveAppointment = async (req, res) => {
    try {
        const data = req.body;
        data.user = req.usuario._id;

        // Convertir la cadena de fecha al formato ISO 8601 formato que es aceptado por mongo
        const dateParts = data.date.split('/');
        const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T00:00:00.000Z`;

        // Crear la instancia de Pet y verificar si existe
        const pet = await Pet.findOne({ _id: data.pet });
        if (!pet) return res.status(404).json({ msg: 'No se encontró la mascota' });

        // Verificar si ya existe una cita para la mascota y usuario especificados
        const existAppointment = await Appointment.findOne({
            $or: [
                {
                    pet: data.pet,
                    user: data.user
                },
                {
                    date: isoDate,
                    user: data.user
                }
            ]
        });

        if (existAppointment) return res.send({ msg: 'Cita ya había sido creada previamente' });

        // Crear la instancia de Appointment con la fecha en formato ISO 8601
        const appointment = new Appointment({ ...data, date: isoDate });
        await appointment.save();

        return res.status(200).json({
            msg: `Cita creada exitosamente en fecha ${data.date}`
        });
    } catch (error) {
        // Manejar errores, incluyendo errores de validación
        if (error.name === 'ValidationError') {
            const validationErrors = Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message,
            }));
            return res.status(400).json({ msg: 'Error de validación', errors: validationErrors });
        } else {
            console.error(error);
            return res.status(500).json({ msg: 'Error al crear la cita', error });
        }
    }
};
