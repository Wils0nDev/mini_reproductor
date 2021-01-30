'use strict'
//para trabajar con el framework de express
let express = require('express');
//authenticacion

let AlbumController = require('../controllers/album');
let api = express.Router();

let md_auth = require('../middleware/authenticate');
//import multipart para subir archivos
let multipart = require('connect-multiparty');
let md_upload = multipart({ uploadDir : './uploads/artist/album'});

api.post('/add-album',md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/album/:artist?/:page?',md_auth.ensureAuth, AlbumController.getAlbum);
api.put('/album-update/:id',md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album-delete/:id',md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id',[md_auth.ensureAuth, md_upload],AlbumController.uploadImage);
api.get('/get-image-album/:imageFile',AlbumController.getImageFile);




module.exports = api