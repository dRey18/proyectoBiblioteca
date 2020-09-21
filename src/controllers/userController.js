'use strict'

var Usuario = require('../models/user')
// var Producto = require('../models/products')
// var Factura = require('../models/factura')
// var Carro = require("../models/shopCar")
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");
// var Categoria = require('../models/category')



function login(req, res) {
    var params = req.body
    Usuario.findOne({nombre: params.nombre}, (err, user)=>{
        if(err) return res.status(500).send({
            message: 'Error'
        })
        if(user){
            bcrypt.compare(params.password, user.password, (err, check)=>{
                if(check){
                    if(params.getToken){
                        return res.status(303).send({
                            token: jwt.createToken(user),
                            SESION_INICIADA: 'Bienvenido '+user.nombre + ' --- ROL: ' + user.rol
                        })
                    }else{
                        user.password= undefined;
                        return res.status(200).send({user})
                    }
                }else{
                    return res.status(404).send({message: 'El usuario no se ha podido identificar'})
                }
            })
            
        }else{
            return res.status(404).send({message: 'El usuario no se ha podido logear'})
        }
    })
    
} 

function defaultUser(){
    var usuario = new Usuario();
    Usuario.find((err, usuarioEncontrado)=>{
    // console.log(usuarioEncontrado.length)
        if(usuarioEncontrado.length == 0) {
            usuario.nombre = 'admin'
            usuario.apellido = 'admin'
            usuario.rol = 'admin'
            usuario.password = 'admin'
            bcrypt.hash(usuario.password, null, null, (err, hash)=>{ 
                usuario.password = hash;
            })
            usuario.save();
        }
    })
}

function createUser(req, res){
    var usuario = new Usuario();
    var params = req.body; 
    var userId = req.user.sub;
    Usuario.findById(userId, (err, usuerEncontrado) =>{
        if(!usuerEncontrado) return res.status(404).send({message: 'Usuario no logeado'})
        if(usuerEncontrado.rol == 'admin'){
            if(params.nombre  && params.password && params.carnet && params.rol){
                usuario.carnet = params.carnet
                usuario.nombre = params.nombre;
                usuario.apellido = params.apellido;
                usuario.rol = params.rol;
                Usuario.find({$or:[ 
                    {nombre: usuario.nombre},
                    {apellido: usuario.apellido},
                    {carnet: usuario.carnet}
                ]}).exec((err, usuarios)=>{
                    console.log(usuarios)
                    if(err) return res.status(500).send({message: 'Error en la peticion de usuarios'})
                    if(usuarios && usuarios.length >=1){
                        return res.status(500).send({message: 'El usuario con ese CARNET/CUI ya existe'})
                    }else{
                        bcrypt.hash(params.password, null, null, (err, hash)=>{
                            usuario.password = hash; 
                            usuario.save((err, usuarioGuardado)=>{
                                if(err) return res.status(500).send({ message: 'Error al guardar el alumno'})
                                if(usuarioGuardado){
                                    res.status(200).send({message: 'Usuario creado con exito!!!'})
                                }else{
                                    res.status(404).send({message: 'Fallo al registrar alumno'})
                                }
                            })
            
                        })
                    }
                })
            }else{
                res.status(200).send({
                    message: 'Rellene todos los datos necesarios'
                })
            }
        }else{
            return res.status(200).send({message:'NO CUENTA CON PERMISOS PARA CREAR A UN USUARIO'})
        }
    })

}

function listarUsuarios(req, res){
    var userId = req.user.sub
    Usuario.findById(userId, (err, usuerEncontrado) =>{
        if(usuerEncontrado.rol == 'admin'){
            Usuario.find((err, usuarios)=>{
                if(err) return res.status(500).send({message: 'Error en la peticion'})
                if(!usuarios) return res.send.status(404).send({message: 'Error en la consulta de usuarios'})
                return res.status(200).send({usuarios})
            })
        }else{
            return res.status(200).send({message:'NO CUENTA CON PERMISOS PARA CREAR A UN USUARIO'})
        }

    })
}

function eliminarUsuario(req, res){
    var params = req.body; 
    var userId = req.user.sub;
    var id = req.params.id

    if(params){
        Usuario.findOne({_id: userId}, (err, usuerEncontrado)=>{
            if(usuerEncontrado){
                if(usuerEncontrado.rol != 'admin') return res.status(500).send({message: 'No cuenta con el permiso de eliminar el usuario :/'})
                Usuario.findByIdAndDelete(id, (err, usuarioEliminado)=>{
                    if(err) return res.status(500).send({message: 'Error en la peticion del usuario'})
                    if(!usuarioEliminado) return res.status(404).send({message: 'Error al eliminar el usuario'})
                    return res.status(200).send({message: "Usuario Eliminado con Exito!!!"})
                })
            }else{
                return res.status(200).send({message: 'El usuario no existe :(('});
            }
        })
    }else{
        return res.status(400).send({message:"Complete los datos"})  
    }
}

function editarUsuario(req, res){
    var userId = req.user.sub;
    var id = req.params.id
    var params = req.body
    delete params.password
    
    if(params){
        Usuario.findOne({_id: userId}, (err, usuerEncontrado)=>{
            if(usuerEncontrado){
                if(usuerEncontrado.rol != 'admin') return res.status(500).send({message: 'No cuenta con el permiso de eliminar el usuario :/'})
                Usuario.findByIdAndUpdate(id, params, {nuevo: true}, (err, usuarioActualizado)=>{
                    if(err) return res.status(500).send({message: 'Error en la peticion'})
                    if(!usuarioActualizado){
                        return res.status(200).send({message: 'Error al encontrar el usuario'})
                    }else{
                        return res.status(200).send({message: "Usuario actualizado con exito!!"})
                    }
                })
            }else{
                return res.status(200).send({message: 'El usuario no existe :(('});
            }
        })
    }else{
        return res.status(400).send({message:"Complete los datos"})  
    }
    
}

// LIBROS
function createUser(req, res){
    var usuario = new Usuario();
    var params = req.body; 
    var userId = req.user.sub;
    Usuario.findById(userId, (err, usuerEncontrado) =>{
        if(!usuerEncontrado) return res.status(404).send({message: 'Usuario no logeado'})
        if(usuerEncontrado.rol == 'admin'){
            if(params.nombre  && params.password && params.carnet && params.rol){
                usuario.carnet = params.carnet
                usuario.nombre = params.nombre;
                usuario.apellido = params.apellido;
                usuario.rol = params.rol;
                Usuario.find({$or:[ 
                    {nombre: usuario.nombre},
                    {apellido: usuario.apellido},
                    {carnet: usuario.carnet}
                ]}).exec((err, usuarios)=>{
                    console.log(usuarios)
                    if(err) return res.status(500).send({message: 'Error en la peticion de usuarios'})
                    if(usuarios && usuarios.length >=1){
                        return res.status(500).send({message: 'El usuario con ese CARNET/CUI ya existe'})
                    }else{
                        bcrypt.hash(params.password, null, null, (err, hash)=>{
                            usuario.password = hash; 
                            usuario.save((err, usuarioGuardado)=>{
                                if(err) return res.status(500).send({ message: 'Error al guardar el alumno'})
                                if(usuarioGuardado){
                                    res.status(200).send({message: 'Usuario creado con exito!!!'})
                                }else{
                                    res.status(404).send({message: 'Fallo al registrar alumno'})
                                }
                            })
            
                        })
                    }
                })
            }else{
                res.status(200).send({
                    message: 'Rellene todos los datos necesarios'
                })
            }
        }else{
            return res.status(200).send({message:'NO CUENTA CON PERMISOS PARA CREAR A UN USUARIO'})
        }
    })

}


// function modificarRol(req, res){
//     var usuarioId = req.user.sub;
//     var params = req.body
//     delete params.nombre
//     delete params.password
//     delete params.usuario
//     delete params.email
//         Usuario.findByIdAndUpdate(usuarioId, params, {nuevo: true}, (err, usuarioActualizado)=>{
//             if(err) return res.status(500).send({message: 'Error en la peticion'})
//             if(!usuarioActualizado){
//                 return res.status(200).send({message: 'Error al encontrar el usuario'})
//             }else if(usuarioActualizado.rol != 'ROL_ADMIN'){
//                 return res.status(200).send({messag:'NO CUENTA CON PERMISOS PARA EDITAR ESTE USUARIO'})
//             }else{
//                 return res.status(200).send({usuario: usuarioActualizado})
//             }
//         })
// }

// function shopCar(req, res){
//     var carrito = new Carro();
//     var params = req.body; 
//     var productoId = params.producto
//     if(params.producto  && params.cantidad){
//         carrito.idUsuario = req.user.sub//{$set: {idUsuario: req.user.sub}};
//         carrito.idProducto = productoId//{$set: {idProducto: productoId}};
//         Producto.findById(productoId, (err, productoEncontrado)=>{
//             if(params.cantidad > productoEncontrado.stock) return res.status(404).send({message: 'No existen suficientes productos en stock'})
//             carrito.cantidad = params.cantidad;
//             Producto.findById(productoId).exec((err, producto)=>{
//                 if(err) return res.status(500).send({message: 'Error en la peticion de producto'})
//                 if(producto){
//                     carrito.price = producto.price;
//                     carrito.save((err, carritoGuardado)=>{
//                         console.log(carritoGuardado)
//                         if(err) return res.status(500).send({ message: 'Error al guardar el carrito'})
//                         if(carritoGuardado){
//                             res.status(200).send({carrito: carritoGuardado})
//                         }else{
//                             res.status(404).send({message: 'Fallo al agregar el carrito'})
//                         }
//                     })
//                 }
//             })
//         })
//     }else{
//         res.status(200).send({
//             message: 'Rellene todos los datos necesarios'
//         })
//     }
// }

// function crearFactura(req, res){
//     var factura = new Factura();
//     var params = req.body; 
//     var productoId = params.producto
//     var idUsuario = req.user.sub
//     var shopId = req.params.shopId
//     if(params.nombre){
//         factura.nombre = params.nombre//{$set: {idUsuario: req.user.sub}};
//         factura.idUsuario = idUsuario
//         Carro.findById(shopId).exec((err, producto)=>{
//             if(err) return res.status(500).send({message: 'Error en la peticion de producto'})
//             if(producto){
//                 console.log(producto)
//                 factura.cantidad = producto.cantidad;
//                 factura.precioU = producto.price;
//                 factura.precioTotal = producto.cantidad*producto.price;
//                 factura.idProducto = producto.idProducto;
//                 actualizarStock(req, res, producto.idProducto, producto.cantidad)
//                 eliminarCarrito(req, res, shopId)
//                 factura.save((err, facturaGuardada)=>{
//                    // console.log(facturaGuardada)
//                     if(err) return res.status(500).send({ message: 'Error al guardar el carrito'})
//                     if(facturaGuardada){
//                         res.status(200).send({Factura: facturaGuardada})
//                     }else{
//                         res.status(404).send({message: 'Fallo al agregar la factura'})
//                     }
//                 })
//             }
//         })
//     }else{
//         res.status(200).send({
//             message: 'Rellene todos los datos necesarios'
//         })
//     }
// }

// function actualizarStock(req, res, productoId, cantidad){
//     Producto.findById(productoId, (err, producto)=>{
//         Producto.findOneAndUpdate({_id: productoId},{'stock': producto.stock-cantidad}, 
//         {new:true}, (err, stockActualizado)=>{
//            if(err) return res.status(500).send({message: 'Error en la peticion del la cantidad'})
//            if(!stockActualizado) return res.status(404).send({message: 'Error al editar la cantidad'})
//        })
//      })
// }

// function eliminarCarrito(req, res, carroId){
//         Carro.findOneAndDelete({_id: carroId}, (err, stockEliminado)=>{
//            if(err) return res.status(500).send({message: 'Error en la peticion del la cantidad'})
//            if(!stockEliminado) return res.status(404).send({message: 'Error al editar la cantidad'})
//        })
// }

// function facturaDetallada(req, res){
//     var factura = new Factura();
//     var idUsuario = req.user.sub
//     Factura.find({idUsuario: idUsuario}).populate("idUsuario").exec((err, factura)=>{
       
//        return res.status(200).send(factura)
//     })

// }

module.exports = {
    login,
    defaultUser,
    createUser,
    listarUsuarios,
    eliminarUsuario,
    editarUsuario
}