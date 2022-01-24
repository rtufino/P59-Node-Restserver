// importar el modulo de express
const express = require('express');
// importar librería para encriptar
const bcrypt = require('bcrypt');
// Importar el Schema de uaurio
const Usuario = require('../models/usuario');
// Iportar undescore
const _ = require('underscore');
// Crear el objeto app
const app = express();

// Configurar los endpoint para usuario
/*Consultar datos*/
app.get('/usuario', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde)

    let limite = req.query.limite || 5;
    limite = Number(limite)

    Usuario.find({})
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    registros: conteo,
                    usuarios
                });
            });
        });
});
/*crear nuevos registros */
app.post('/usuario', (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});
/*actualizar registros */
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // delete body.password;
    // delete body.google;

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        });
    });
});

/*Eliminar registros (cambiar a inactivo) */
app.delete('/usuario', (req, res) => {
    res.json('delete Usuario');
});

// exportar para que se pueda utilizar en otros módulos
module.exports = app;