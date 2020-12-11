const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SEED = require('../config/config').SEED;
let Usuario = require('../models/usuario');

app.post('/', (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No se encontro el usuario',
                errors: err
            })
        }

        if (!usuarioDB) {
            //Para checar email
            return res.status(400).json({
                ok: false,
                mensaje: 'Correo o contraseña incorrecta',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) { //Si no hace match body.password con usuarioDB.password
            //Para checar contraseñas
            return res.status(400).json({
                ok: false,
                mensaje: 'Correo o contraseña incorrecta',
                errors: err
            });
        }

        usuarioDB.password = null;
        // Generar Token          La data               SEED, llave que tendra      4 horas expira
        let token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    });

});

module.exports = app;