// CRUD pedidos
const _ = require('underscore');
const express = require('express');
const app = express();

const Pedido = require('../models/pedidos');
const Driver = require('../models/drivers');

let evaluarFranjaHoras = horas =>{
    let [inicio, fin] = horas.split('-');
    
    let hoy = new Date();

    hoy.setHours(Number(inicio.split(':')[0]));
    hoy.setMinutes(Number(inicio.split(':')[1]));
    let dInicio = hoy.getTime();

    hoy.setHours(Number(fin.split(':')[0]));
    hoy.setMinutes(Number(fin.split(':')[1]));
    let dFinal = hoy.getTime();
    if(((dFinal-dInicio) < 3600000) || ((dFinal - dInicio) > (3600000 * 8))){
        return false;
    }
    return true;
}

app.post('/pedidos', (req, res) => {
    let body = _.pick(req.body, ['cliente', 'direccion', 'horas', 'estado']);

    let pedido = new Pedido(body);

    // Verificacion de franja de horas, 1 hora a 8 horas
    // Formato esperado: HH:mm-HH-mm
    let {horas} = body;

    if(horas == undefined){
        return res.status(400).json({
            status: 400,
            data: 'Debe proporcionar los campos obligatorios'
        });
    }

    if(!evaluarFranjaHoras(horas)){
        return res.status(400).json({
            status: 400,
            data: 'La franja horaria es invalida, debe estar entre 1 y 8'
        });
    }

    pedido.save((err, field) => {
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

app.get('/pedidos/:id', (req, res) => {
    let id = req.params.id;

    Pedido.findById(id, (err, field) => {
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

app.get('/pedidos', (req, res) => {
    let desde = Number(req.query.desde);
    let hasta = Number(req.query.hasta);

    Pedido.find({})
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

app.put('/pedidos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['direccion', 'horas', 'estado']);

    let {horas} = body;

    if(horas != undefined){
        if(!evaluarFranjaHoras(horas)){
            return res.status(400).json({
                status: 400,
                data: 'La franja horaria es invalida, debe estar entre 1 y 8'
            });
        }
    }

    Pedido.findByIdAndUpdate(id, body, {
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

app.delete('/pedidos/:id', (req, res) => {
    let id = req.params.id;

    Pedido.findByIdAndRemove(id, (err, field) => {
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

let asignarPedidoPendiente = (pedido, activos) => {
    let pedidosDrivers = {};
    let pedidosDrivers_ordbypedidos = {};
    let condicion = {estado: 'activo'};
    if(activos.length > 0){
        activos.forEach((item, index) => {
            if(pedidosDrivers[item.driver] == undefined){
                pedidosDrivers[item.driver] = 0
            }

            pedidosDrivers[item.driver] += 1;
        });
        
        Object.entries(pedidosDrivers).forEach(item => {
            if(pedidosDrivers_ordbypedidos[item[1]] == undefined){
                pedidosDrivers_ordbypedidos[item[1]] = []
            }
            pedidosDrivers_ordbypedidos[item[1]].push(item[0]);
        });

        let driversConMenosPedidos = pedidosDrivers_ordbypedidos[Object.keys(pedidosDrivers_ordbypedidos)[0]]

        condicion = {estado: 'activo', $or: [{_id: {$nin: Object.keys(pedidosDrivers)}}, {_id: {$in: driversConMenosPedidos}}]};
        console.log(pedidosDrivers, driversConMenosPedidos);
    }


    Driver.findOne(condicion, (err, field) => {
        if(err){
            console.log('No se pudo obtener los drivers activos');
        }

        if(field != undefined){
            Pedido.findByIdAndUpdate(pedido.id, {driver: field.id, estado: 'activo'}, (err, fieldPedido) => {
                if(err){
                    console.log('No se pudo asignar el pedido pendiente', pedido.id);
                }
            });
        }
    });
};

let asignarPedidosPendientes = () => {
    Pedido.find({$or: [{estado: 'pendiente'}, {estado: 'activo'}]}, (err, field) => {
        if(err){
            console.log('No se pudo obtener los pedidos pendientes');
        }

        if(field != undefined){
            if(Array.isArray(field)){
                field.filter(item => item.estado == 'pendiente').forEach(item => asignarPedidoPendiente(item, field.filter(item => item.estado == 'activo')));
            }else{
                asignarPedidoPendiente(field);
            }
        }
    });
};

module.exports = {app, asignarPedidosPendientes};