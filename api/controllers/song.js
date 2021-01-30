'use strict'
const { response } = require('express');
const song = require('../models/song');
let Song = require('../models/song');

/*para poder obtener los ficheros */
var fs = require('fs');
var path = require('path');

function getSongs(req, res) {
    var albumId = req.params.album;
    if (!albumId) {
        var find = Song.find({}).sort('number');
    } else {
        var find = Song.find({ album: albumId }).sort('number');

    }
    find.populate({ path: 'album', populate: { path: 'artist', model: 'Artist' } })
        .exec(function (err, songs) {
            if (err) {
                res.status(500).send({ mesagge: 'error en la petision' });
            } else {
                if (!songs) {
                    res.status(404).send({ mesagge: ' no hay camciones ' });
                } else {
                    res.status(200).send({ songs });
                }
            }
        });
}




function getSong(req, res) {

    let idAlbum = req.params.album
    if (!idAlbum) {
        res.status(500).send({ message: "Error de peticion" })

    } else {
        var find = Song.find({ album: idAlbum }).sort('number');

        find.populate({
            path: 'album', 
            populate: { 
                path: 'artist', model: 'Artist' 
            } 
        }).exec((err, songs) => {
            if (err) {
                res.status(500).send({ message: "Error de peticion" })

            } else {
                if (!songs) {
                    res.status(404).send({ message: "No se pudo obtener la lista de canciones" })
                } else {
                    res.status(200).send({ song: songs })

                }
            }
        })
    }




}

function saveSong(req, res) {

    let song = new Song();
    let params = req.body;

    song.number = params.number
    song.name = params.name
    song.duration = params.duration
    song.fichero = 'null'
    song.album = params.album

    song.save((err, songStored) => {
        if (err) {
            res.status(500).send({ message: "Error de peticion" })
        } else {
            if (!songStored) {
                res.status(404).send({ message: "No se pudo guardar la musica" })

            } else {
                res.status(200).send({ song: songStored })

            }
        }
    })
}

function updateSong(req, res){

    let idSong = req.params.id
    let update = req.body

    Song.findByIdAndUpdate(idSong,update,{useFindAndModify: false},(err,updateStored)=>{
        if(err){
            res.status(500).send({message : "Error de peticion"});
        }else{
            if(!updateStored){
                res.status(404).send({message : "No se pudo actulizar la musica"});
            }else{
                res.status(200).send({song : updateStored});
            }
        }
    } )
}

function deleteSong(req, res){
    
    let idSong = req.params.id;
    
    Song.findByIdAndRemove(idSong,(err,removeSong)=>{
        if(err){
            res.status(500).send({message : "Error de peticion"});
        }else{
            if(!removeSong){
                res.status(404).send({message : "No se pudo eliminar la musica"});
            }else{
                res.status(200).send({song : removeSong});
            }
        }
    })

}

function uploadFile(req, res){
    let songId = req.params.id;
    let file_name = "No subido..";

    if(req.files){
        let file_path = req.files.fichero.path;
        let file_split = file_path.split('\\');
        let file_name = file_split[3];

        let file_ext = file_name.split('.');
        

        if(file_ext[1] == 'mp3' || file_ext[1] == 'ogg'){
            Song.findByIdAndUpdate(songId, {fichero : file_name},{useFindAndModify: false},(err, songUpload)=>{
                if(!songUpload){
                    res.status(401).send({ message : "No se ha podido subir la musica"});
                }else{
                    res.status(200).send({ song : songUpload});
                } 
            });
        }else{
            res.status(401).send({
                message : "Extencion de archivo no valida"
            }); 
        }
    }
}

function getSongFile(req, res){
    var songFile = req.params.songFile;
    var path_file = './uploads/artist/song/'+songFile;
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(401).send({
                message: "Musica no existe"
            });
        }
    });
}


module.exports = {
    getSong,
    saveSong,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}

