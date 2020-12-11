const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

//=============================================
// Verificar token - Middleware
//=============================================

exports.verificaToken = function(req, res, next) {
    let token = req.query.token;

    //Verifica si el token es valido 
    jwt.verify(token, SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token no valido',
                errors: err
            });
        }

        //información que nos envio el frontend
        req.usuario = decode.usuario;
        //Continua con lo siguiente
        next();
    });
}