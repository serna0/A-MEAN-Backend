const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let mdAutenticacion = require('../middlewares/autenticacion');
let Usuario = require('../models/usuario');

//=============================================
// Obtener todos los usuarios
//=============================================
app.get('/', (req, res, next) => {
    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar los usuarios',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuarios
                })
            }
        )
});


//=============================================
// Actualizar los usuarios
//=============================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    const id = req.params.id;
    let body = req.body;

    Usuario.findById(id, 'nombre email role')
        .exec(
            (err, usuario) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'No se encontro el usuario',
                        errors: err
                    });
                }

                if (!usuario) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'No se encontro el usuario',
                        errors: err
                    });
                }

                usuario.nombre = body.nombre;
                usuario.email = body.email;
                usuario.role = body.role;

                usuario.save((err, usuarioGuardado) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar el usuario',
                            errors: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        usuario: usuarioGuardado
                    });
                });
            }
        );
});

//=============================================
// Crear nuevo usuario
//=============================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    const body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario no se creo',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });
});

//=============================================
// Borrar usuarios por ID
//=============================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    const id = req.params.id;
    Usuario.findOneAndDelete(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el usuario',
                errors: { message: 'No existe el usuario' }
            });
        }

        usuarioBorrado.password = '';
        res.status(200).json({
            ok: true,
            mensaje: 'Usuario eliminado correctamente',
            usuario: usuarioBorrado
        })
    });
});

module.exports = app;