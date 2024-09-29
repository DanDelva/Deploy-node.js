import { Router } from 'express'
import { getJuegos, saveJuego,updateJuego,deleteJuego } from '../Controllers/JuegosController.js'
import { subirImagen } from '../Middleware/Storage.js'
import { verificar } from '../Middleware/Auth.js';
const rutas = Router()

rutas.get('/api/juegos',verificar, getJuegos) 
rutas.get('/api/juegos/:id',verificar, getJuegos) 
rutas.post('/api/juegos',verificar,subirImagen.single('imagen'), saveJuego) 
rutas.put('/api/juegos/:id',verificar, subirImagen.single('imagen'), updateJuego) 
rutas.delete('/api/juegos/:id',verificar, deleteJuego) 

export default rutas