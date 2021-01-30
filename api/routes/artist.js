'use strict'
//para trabajar con el framework de express
let express = require('express');
//authenticacion


let ArtistController = require('../controllers/artist')

let api = express.Router();
//import middleware
let md_auth = require('../middleware/authenticate');
//import multipart para subir archivos
let multipart = require('connect-multiparty');
let md_upload = multipart({ uploadDir : './uploads/artist'});


api.get('/artists/:page?',md_auth.ensureAuth,ArtistController.getAllArtist);
api.get('/artist/:id',md_auth.ensureAuth,ArtistController.getArtist);

api.post('/artist-add',md_auth.ensureAuth,ArtistController.saveArtist);
api.put('/artist/:id',md_auth.ensureAuth,ArtistController.updateArtist);
api.delete('/artist/:id',md_auth.ensureAuth,ArtistController.deleteArtist);
api.post('/upload-image-artist/:id',[md_auth.ensureAuth, md_upload],ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile',ArtistController.getImageFile);


module.exports = api