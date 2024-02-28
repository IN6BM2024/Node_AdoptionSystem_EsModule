'use strict';

import { Schema, model } from "mongoose";

// Definición del esquema para las citas (appointments)
const appointmentSchema = Schema({
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['CREATED', 'ACCEPTED', 'CANCELLED', 'COMPLETED'],
        default: 'CREATED',
        required: true,
    },
    pet: {
        type: Schema.ObjectId,
        ref: 'pet',
        required: true,
    },
    user: {
        type: Schema.ObjectId,
        ref: 'user',
        required: true,
    },
}, {
    versionKey: false,
});

export default model('Appointment', appointmentSchema);
