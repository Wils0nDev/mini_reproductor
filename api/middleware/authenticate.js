'use-strict'
let jwt = require('jwt-simple');
let moment = require('moment');
let secret = 'clave_secreta_reproductor'; //clave secreta par hashear el objeto payload

exports.ensureAuth = function(req, res, next){

    //los headers.
    if(!req.headers.authorization){

        return res.status(403).send({message : "falta la cabecera de autenticacion"});

    }

    let token = req.headers.authorization.replace(/['"]+/g,'');

    try {

        var payload = jwt.decode(token, secret)

        if(payload.ex <= moment().unix() ){
            return res.status(401).send({message : "El Token ha expirado"});

        }
        
    } catch (error) {
        return res.status(403).send({message : "Token no valido"});

    }

    req.user = payload;
    next();

}