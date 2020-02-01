require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(require('./routes/drivers'));
let pedidosRoute = require('./routes/pedidos');
app.use(pedidosRoute.app);
app.use(require('./routes/clientes'));

const puerto = process.env.PORT;
const servidorDB = process.env.DB;

mongoose.connect(servidorDB, { useNewUrlParser: true, useUnifiedTopology: true}, (err, res) => {
    if(err){
        console.log('No se pudo conectar la DB', err, servidorDB);
    }else{
        console.log('Conexion DB realizada');
    }
});

setInterval(pedidosRoute.asignarPedidosPendientes, 5000);

app.listen(puerto, () => {
    console.log(`Servidor iniciado en el puerto ${puerto}`);
})