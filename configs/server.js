'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import userRoutes from '../src/user/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import petRoutes from '../src/pet/pet.routes.js';
import appointmentRoutes from '../src/appointment/appointment.routes.js';

// Configura los middleware de la aplicación
const configurarMiddlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
};

// Configura las rutas de la aplicación
const configurarRutas = (app) => {
    const usuarioPath = '/adoptionSystem/v1/users';
    const authPath = '/adoptionSystem/v1/auth';
    const petPath = '/adoptionSystem/v1/pets';
    const appointmentPath = '/adoptionSystem/v1/appointment';

    app.use(usuarioPath, userRoutes);
    app.use(authPath, authRoutes);
    app.use(petPath, petRoutes);
    app.use(appointmentPath, appointmentRoutes);
};

// Conecta a la base de datos MongoDB
const conectarDB = async () => {
    try {
        await dbConnection();
        console.log('Conexión a la base de datos exitosa');
    } catch (error) {
        console.error('Error conectando a la base de datos:', error);
        process.exit(1); // Salir si la conexión falla
    }
};

// Inicializa y configura el servidor
export const iniciarServidor = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    await conectarDB(); // Conexión a la base de datos
    configurarMiddlewares(app); // Configurar middleware
    configurarRutas(app); // Configurar rutas

    // Inicia el servidor
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};
