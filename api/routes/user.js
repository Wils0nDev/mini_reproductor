'use strict'
//para trabajar con el framework de express
let express = require('express');
let UserController = require('../controllers/user')

//uso del ruteador de express
let api = express.Router();

//import middleware
let md_auth = require('../middleware/authenticate');

//import multipart para subir archivos
let multipart = require('connect-multiparty');
//middleware de files
let md_upload = multipart({ uploadDir : './uploads/user'});


api.get('/probando-controlador',md_auth.ensureAuth,UserController.pruebas);
api.post('/add-user',UserController.saveUser);
api.post('/login',UserController.loginUser);
api.put('/update-user/:id',[md_auth.ensureAuth, md_upload],UserController.updateUser);
api.post('/upload-image/:id',[md_auth.ensureAuth, md_upload],UserController.uploadImage);
api.get('/get-image-user/:imageFile',UserController.getImageFile);


module.exports = api;