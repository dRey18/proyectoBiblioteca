'use stric'

const mongoose = require("mongoose")
const app = require("./app")
var Usuario = require('../src/controllers/userController')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/proyectoBiblioteca', { useNewUrlParser: true, useUnifiedTopology:true }).then(() =>{
    console.log('Se encuentra conectado a la Base de Datos');

    app.set('port', process.env.PORT || 3000)
    app.listen(app.get('port'), () => {
       Usuario.defaultUser();
        console.log(`El servidor esta corriendo en el puerto: ${app.get('port')}`);
    })
    
}).catch(err => console.log(err))