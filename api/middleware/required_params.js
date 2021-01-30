'use-strict'
let jwt = require('jwt-simple');
let moment = require('moment');
let secret = 'clave_secreta_reproductor'; //clave secreta par hashear el objeto payload

exports.requiredParams = function(req, res, next){

    if(req.route.path == '*'){
        res.send({message : "Not Found"});
    };
  
    /*req.user = payload;*/
    next();

}