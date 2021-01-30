const express = require('express')
const app = express()

//configurando body-parser
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cargar rutas
let user_routes = require('./routes/user')
let artist_routes = require('./routes/artist');
let albun_routes = require('./routes/album');
let song_routes = require('./routes/song');

//configurar cabeceras  http

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Controll-Allow-Methods','GET,POST,OPTIONS,PUT,DELETE');
    res.header('Allow','GET,POST,OPTIONS,PUT,DELETE');

    next();
});

//ruta base

app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', albun_routes);
app.use('/api', song_routes);






module.exports = app;