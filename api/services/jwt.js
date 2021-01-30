'use-strict'
let jwt = require('jwt-simple');
let moment = require('moment');
let secret = 'clave_secreta_reproductor'; //clave secreta par hashear el objeto payload

exports.createToken = function(user){

    let payload = {
        sub : user._id, //sub : para guardar el ide de usuario
        name : user.name,
        surname : user.surname,
        role : user.role,
        image : user.image,
        iat : moment().unix(),
        exp : moment().add(30, 'days').unix
    }

    return jwt.encode(payload, secret);
}