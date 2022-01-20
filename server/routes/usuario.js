// importar el modulo de express
const express = require('express');
// importar librería para encriptar
const bcrypt = require('bcrypt');
// Importar el Schema de uaurio
const Usuario = require('../models/usuario');
// Crear el objeto app
const app = express();

// Configurar los endpoint para usuario
/*Consultar datos*/
app.get('/usuario', (req, res) => {
    res.json('get Usuario');
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
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            mensaje: "El nombre es necesario"
        });
    } else {
        res.json({
            persona: body
        });
    }


});

/*Eliminar registros (cambiar a inactivo) */
app.delete('/usuario', (req, res) => {
    res.json('delete Usuario');
});

// exportar para que se pueda utilizar en otros módulos
module.exports = app;