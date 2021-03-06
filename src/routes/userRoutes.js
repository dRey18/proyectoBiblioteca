'use stric'

var express = require("express")
var UserController = require("../controllers/userController")
var md_auth = require('../middlewares/authenticated');
const userController = require("../controllers/userController");


//RUTAS
var api = express.Router();
api.post('/login', UserController.login)
api.post('/registrar', md_auth.ensureAuth, UserController.createUser)
api.get('/listarUsuarios', md_auth.ensureAuth, userController.listarUsuarios)
api.delete('/eliminarUsuario/:id', md_auth.ensureAuth, UserController.eliminarUsuario)
api.put('/editarUsuario/:id', md_auth.ensureAuth, UserController.editarUsuario)
// api.put('/editarClientes/:id', md_auth.ensureAuth, UserController.editarClientes)
// api.delete('/eliminarClientes/:id', md_auth.ensureAuth, UserController.eliminarClientes)
// api.put('/agregar_a_Carrito', md_auth.ensureAuth, UserController.añadirCarrito)
// api.put('/comprar', md_auth.ensureAuth, UserController.comprar)
// api.get('/facturasXcliente', md_auth.ensureAuth, UserController.facturasUsuario)
// api.get('/productosXfactura', md_auth.ensureAuth, UserController.productoXFactura)
// api.post('/crearPDF', UserController.createPDF)

module.exports = api;