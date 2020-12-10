// Requires
let express = require('express');
const mongoose = require("mongodb");
// Iniciar variables
const app = express();
// Conexion a la DB
mongoose.connect('mongodb://localhost/hospitalDB', { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Correctamente'
    });
});

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Puerto: 3000 \x1b[32m%s\x1b[0m', 'online');
});