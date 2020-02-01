// CRUD clientes

const _ = require('underscore');
const express = require('express');
const app = express();

const Cliente = require('../models/clientes');
const Pedido = require('../models/pedidos');

app.post('/clientes', (req, res) => {
    let body = _.pick(req.body, ['nombre', 'apellido', 'correo', 'telefono', 'estado']);
    
    let cliente = new Cliente(body);

    cliente.save((err, field) => {
        if(err){
            return res.status(400).json({
                status: 400,
                data: err
            });
        }

        return res.json({
            status: 201,
            data: field
        });
    });
});

app.get('/clientes', (req, res) => {
    let desde = Number(req.query.desde);
    let hasta = Number(req.query.hasta);
    
    Cliente.find({})
    .skip(isNaN(desde) ? 0 : desde)
    .limit(isNaN(hasta) ? 100 : hasta)
    .exec((err, field) => {
        if(err){ 
            return res.status(400).json({
                status: 400,
                data: err
            });
        }
        return res.json({
            status: 200,
            data: field
        })
    });
});

app.get('/clientes/:id', (req, res) => {
    let id = req.params.id;

    Cliente.findById(id, (err, field) => {
            if(err){ 
                return res.status(400).json({
                    status: 400,
                    data: err
                });
            }
            return res.json({
                status: 200,
                data: field
            })
    });
});

app.put('/clientes/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'apellido', 'correo', 'telefono', 'estado']);

    Cliente.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, field) => {
        if(err){ 
            return res.status(400).json({
                status: 400,
                data: err
            });
        }
        
        return res.json({
            status: 200,
            data: field
        });
    });
});

app.delete('/clientes/:id', (req, res) => {
    let id = req.params.id;

    Cliente.findByIdAndRemove(id, (err, field) => {
        if(err){ 
            return res.status(400).json({
                status: 400,
                data: err
            });
        }

        return res.json({
            status: 200,
            data: field
        });
    });
});

module.exports = app;