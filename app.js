// Requires
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const appRoutes = require('./routes/app');
const usuariosRoutes = require('./routes/usuarios');
const loginRoutes = require('./routes/login');

// Iniciar variables
const app = express();

// Body-Parser - parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexion a la DB
mongoose.connect('mongodb://localhost/hospitalDB', { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});
mongoose.set('useCreateIndex', true);

// Rutas
app.use('/usuario', usuariosRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Puerto: 3000 \x1b[32m%s\x1b[0m', 'online');
});