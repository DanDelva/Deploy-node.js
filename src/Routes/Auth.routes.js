import { Router } from 'express';
import{crearUsuario,login} from '../Controllers/AuthController.js'

const rutas = Router()
rutas.post('/api/usuarios',crearUsuario)
rutas.post('/api/login',login)

export default rutas
