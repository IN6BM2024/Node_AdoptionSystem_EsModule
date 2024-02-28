import Pet from "../pet/pet.model.js";
import Appointment from "../appointment/appointment.model.js";
import { format } from "date-fns";

export const saveAppointment = async (req, res) => {
  try {
    const data = req.body;
    data.user = req.usuario._id;

    // Convertir la cadena de fecha y hora al formato ISO 8601 formato que es aceptado por mongo
    const dateParts = data.date.split(" "); // Dividir por espacio para separar fecha y hora
    const date = dateParts[0];
    const time = dateParts[1];
    const [day, month, year] = date.split("/");
    const isoDate = `${year}-${month}-${day}T${time}:00.000Z`;

    // Crear la instancia de Pet y verificar si existe
    const pet = await Pet.findOne({ _id: data.pet });
    if (!pet) return res.status(404).json({ msg: "No se encontró la mascota" });

    // Verificar si ya existe una cita para la mascota y usuario en la fecha especificada
    const existAppointment = await Appointment.findOne({
      pet: data.pet,
      user: data.user,
      date: {
        $gte: new Date(isoDate).setHours(0, 0, 0, 0), // Fecha inicio del día
        $lt: new Date(isoDate).setHours(23, 59, 59, 999), // Fecha fin del día
      },
    });

    if (existAppointment)
      return res.send({
        msg: "El usuario y la mascota ya tienen una cita para este día",
      });

    // Crear la instancia de Appointment con la fecha en formato ISO 8601
    const appointment = new Appointment({ ...data, date: isoDate });
    await appointment.save();

    return res.status(200).json({
      msg: `Cita creada exitosamente en fecha ${data.date}`,
    });
  } catch (error) {
    // Manejar errores, incluyendo errores de validación
    console.error(error);
    return res.status(500).json({ msg: "Error al crear la cita", error });
  }
};

export const showAppointments = async (req, res) => {
  const userId = req.usuario;

  try {
    // Obtener todas las citas del usuario
    const appointments = await Appointment.find({ user: userId }).populate(
      "pet user"
    );

    if (!appointments || appointments.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron citas para este usuario" });
    }

    // Formatear las fechas y obtener nombres de mascotas y usuarios
    const formattedAppointments = appointments.map((appointment) => ({
      date: format(new Date(appointment.date), "dd/MM/yyyy HH:mm"),
      status: appointment.status,
      pet: appointment.pet
        ? appointment.pet.name
        : "Nombre de mascota no disponible",
      user: appointment.user
        ? appointment.user.nombre
        : "Nombre de usuario no disponible",
    }));

    res.status(200).json({ appointments: formattedAppointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
