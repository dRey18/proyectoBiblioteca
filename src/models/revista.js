'use stric'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var RevistaSchema = Schema({
    autor: String,
    titulo: String,
    edicion: Number,
    descripcion: String,
    frecuenciaAcutual: String,
    ejemplares: Number,
    temas: Number, 
    palabrasClave: String,
    copias: Number, 
    dispinibles: Number
})

module.exports = mongoose.model('revista', RevistaSchema);