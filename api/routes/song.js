'use strict'
//para trabajar con el framework de express
let express = require('express');
let api = express.Router();

//authenticacion

let SongController = require('../controllers/song')

let md_auth = require('../middleware/authenticate');
let md_required = require('../middleware/required_params');

//import multipart para subir archivos
let multipart = require('connect-multiparty');
let md_upload = multipart({ uploadDir : './uploads/artist/song'});

    
api.get('/song/:album',md_auth.ensureAuth,SongController.getSong);
api.post('/song-add',md_auth.ensureAuth,SongController.saveSong);
api.put('/song-update/:id',md_auth.ensureAuth,SongController.updateSong);
api.delete('/song-update/:id',md_auth.ensureAuth,SongController.updateSong);
api.delete('/song-delete/:id',md_auth.ensureAuth,SongController.deleteSong);
api.post('/upload-song/:id',[md_auth.ensureAuth, md_upload],SongController.uploadFile);
api.get('/get-song/:songFile',[md_auth.ensureAuth, md_upload],SongController.getSongFile);

api.get("*", md_required.requiredParams);
module.exports = api