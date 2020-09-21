'use stric'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var UserSchema = Schema({
    carnet: Number, 
    nombre: String,
    apellido: String,
    rol: String,
    password: String,
    prestamos: [{
        nombre: String,
        autor: Number,
        fechaPrestamo: Date,
        codigoLibro: { type: Schema.ObjectId, ref: 'libro' },
        codigoRevista: { type: Schema.ObjectId, ref: 'revista' },
    }]
})

module.exports = mongoose.model('user', UserSchema);