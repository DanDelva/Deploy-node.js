import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';
import { JWT_SECRET, JWT_EXPIRES } from '../config.js';

const esquema = new mongoose.Schema({
    nombre: String, correo: String, password: String
}, { versionKey: false });

const UsuarioModel = mongoose.model('usuarios', esquema);

export const crearUsuario = async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;
        var validacion = validar(nombre, correo, password);
        if (validacion.length === 0) {
            let pass = await bcryptjs.hash(password, 8); // encriptar contraseña
            const nuevoUsuario = new UsuarioModel({
                nombre: nombre, correo: correo, password: pass
            });
            await nuevoUsuario.save();
            return res.status(200).json({ status: true, message: 'Usuario creado' });

        } else {
            return res.status(400).json({ status: false, message: validacion });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: [error.message] });
    }
};

export const login = async (req, res) => {
    try {
        const { correo, password } = req.body;
        var validacion = validar('nombre', correo, password);
        if (validacion.length === 0) {
            let info = await UsuarioModel.findOne({ correo: correo });
            if (!info || !(await bcryptjs.compare(password, info.password))) {
                return res.status(404).json({ status: false, errors: ['Usuario no existe'] });
            }
            const token = jwt.sign({ id: info._id }, JWT_SECRET, {
                expiresIn: JWT_EXPIRES
            });
            const usuario = { id: info._id, nombre: info.nombre, correo: info.correo, token: token };
            return res.status(200).json({ status: true, data: usuario, message: 'Acceso correcto' });
        } else {
            return res.status(400).json({ status: false, message: validacion });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: [error.message] });
    }
};

const validar = (nombre, correo, password) => {
    var errors = [];
    if (nombre === undefined || nombre.trim() === '') {
        errors.push('El nombre NO debe estar vacío');
    }
    if (correo === undefined || correo.trim() === '') {
        errors.push('El correo NO debe estar vacío');
    }
    if (password === undefined || password.trim() === '' || password.length < 8) {
        errors.push('La contraseña NO debe estar vacía y debe tener mínimo 8 caracteres');
    }
    return errors;
};
