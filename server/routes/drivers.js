// CRUD drivers

const _ = require('underscore');
const express = require('express');
const app = express();

const Driver = require('../models/drivers');
const Pedido = require('../models/pedidos');

app.post('/drivers', (req, res) => {
    let body = _.pick(req.body, ['nombre', 'apellido', 'cedula', 'telefono', 'estado']);
    //console.log(body);
    let driver = new Driver(body);

    driver.save((err, field) => {
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

app.get('/drivers', (req, res) => {
    let desde = Number(req.query.desde);
    let hasta = Number(req.query.hasta);
    
    Driver.find({})
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

app.get('/drivers/:id', (req, res) => {
    let id = req.params.id;

    Driver.findById(id)
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

app.get('/drivers/pedidos/:id', (req, res) => {
    let id = req.params.id;

    Pedido.find({estado: 'activo', driver: id}, (err, field) => {
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

app.put('/drivers/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'apellido', 'correo', 'estado']);

    Driver.findByIdAndUpdate(id, body, {
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

app.delete('/drivers/:id', (req, res) => {
    let id = req.params.id;

    Driver.findByIdAndRemove(id, (err, field) => {
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