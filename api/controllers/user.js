'use strict'

let bcrypt = require('bcrypt-nodejs');
let User = require('../models/user');
let jwt = require('../services/jwt');

/*para poder obtener los ficheros */
var fs = require('fs');
var path = require('path');


function pruebas(req, res) {
    res.status(200).send({
        message: `Probando una accion del controlador de usuarios`
    })
}

function saveUser(req, res) {
    let user = new User();



    let params = req.body;
    //console.log(params);
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image = 'null';

    if (params.password) {
        bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;
            if (user.name != null &&
                user.surname != null &&
                user.email != null) {
                    //guardar el usuario
                    user.save((err, userStored) => {
                        if(err){
                            res.status(500).send({ message: 'Error al guardar usuario' })
                        }else{
                            if(!userStored){
                                res.status(404).send({ message: 'No se registro el usuario' })
                            }else{
                                res.status(200).send({
                                     user : userStored,
                                     message: 'Usuario registrado' 
                                    })

                            }

                        }
                    })
            }else{
                res.status(200).send({ message: 'Introduce todos los campos' })
            }
        })
    } else {
        res.status(200).send({ message: 'Introduce la contraseña' })
    }
}

function loginUser(req, res){

    let params = req.body;
    let email = params.email;
    let password = params.password;

    //USAMOS ORM DE MONGUS

    User.findOne({email: email.toLowerCase()},(err, user)=>{
        if(err){
            res.status(500).send({
                message : 'Error en la peticion'
            })
        }else{
            if(!user){
                res.status(404).send({
                    message : "El usuario no existe"
                })
            }else{
                bcrypt.compare(password, user.password, (err,check) => {
                    if(check){
                        //devolver los datos del usuario logueado
                        if(params.gethash){
                            //devolvier un token de JWT
                            res.status(200).send({
                                token : jwt.createToken(user)
                            });

                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({
                            message : "El usuario no ha podido loguearse"
                        })
                    }
                })
            }
        }
    })
}

function updateUser(req, res){

    let userId = req.params.id;
    let update = req.body;

    User.useFindAndModify(userId, update, (err, userUpdated) => {
        if(err){
            res.status(500).send({ message : "Error al actulizar el usuario" })
        }else{
            if(!userUpdated){
                res.status(401).send({ message : "No se ha podido actulizar el usuario"});
            }else{
                res.status(200).send({ user : userUpdated});
            }
        }
    })

}

function uploadImage(req, res){
    let userId = req.params.id;
    var file_name = "No subido..";

    if(req.files){

        let file_path = req.files.image.path;
        let file_split = file_path.split('\\');
        let file_name = file_split[2];

        let file_ext = file_name.split('.');

        if(file_ext[1] == 'png' || file_ext == 'jpg' || file_ext[1] == 'gif'){
            User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
                if(!userUpdated){
                    res.status(401).send({ message : "No se ha podido actulizar el usuario"});
                }else{
                    res.status(200).send({ image: file_name, user : userUpdated});
                } 
            });
        }else{
            res.status(401).send({
                message : "Extencion de archivo no valida"
            });
        }

    }else{
        res.status(401).send({message : "No ha podido subir la imagen"});
    }
}

/* metodo para obtener las imagenes */

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/user/'+imageFile;
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(401).send({
                message: "Imagen no existe"
            });
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};