'use strict'
const { response } = require('express');
const album = require('../models/album');
let Album = require('../models/album');
let Song = require('../models/song')
//para hacer paginacion
let mongoosePaginate = require('mongoose-pagination');
const artist = require('../models/artist');
//
/*para poder obtener los ficheros */
var fs = require('fs');
var path = require('path');

function getAlbum(req, res) {
    if (req.params.page) {
        var page = req.params.page;
    } else {
        var page = 1;

    }

    /*total de items q sacara en un inicio*/
    let itemPerPage = 3; //mostrara 3 elementos por pagina

    let idArtist = req.params.artist
    if (!idArtist) {
        var find = Album.find({}).sort('title')
    } else {
        var find = Album.find({ artist: idArtist }).sort('year');
    }

    find.populate({ path: 'artist' }).paginate(page, itemPerPage, (err, albums, total) => {
        if (err) {
            res.status(500).send({ message: "Error de peticion" })

        } else {
            if (!albums) {
                res.status(404).send({ message: "No se pudo obtener albunes" })
            } else {
                res.status(200).send({ albums: albums, total: total })

            }
        }
    })

    



}
function saveAlbum(req, res) {
    let album = new Album();
    let params = req.body;

    album.title = params.title,
        album.description = params.description,
        album.year = params.year,
        album.image = 'null'
    album.artist = params.artist

    album.save((err, albumStored) => {
        if (err) {
            res.status(500).send({ message: "Error de peticion" });
        } else {
            if (!albumStored) {
                res.status(404).send({ message: "No se pudo guardar el album" });

            } else {
                res.status(200).send({ album: albumStored });
            }

        }
    })
}

function updateAlbum(req, res) {

    let idAlbum = req.params.id;
    let update = req.body;
    Album.findByIdAndUpdate(idAlbum, update, { useFindAndModify: false }, (err, albumUpdate) => {
        if (err) {
            res.status(500).send({ message: "Error en la petición" });

        } else {
            if (!albumUpdate) {
                res.status(404).send({ message: "El album no existe" })

            } else {
                res.status(200).send({ album: albumUpdate })

            }
        }
    })

}

function deleteAlbum(req, res) {
    var albumId = req.params.id

    Album.findByIdAndRemove(albumId, { useFindAndModify: false }, (err, albumRemove) => {
        if (err) {
            res.status(500).send({ message: "Error en la petición" });

        } else {
            if (!albumRemove) {
                res.status(404).send({ message: "El album no se puede borrar" })

            } else {
                let albumsId = albumRemove._id
                Song.find({ album: albumsId }).deleteMany((err, songRemove) => {
                    if (err) {
                        res.status(500).send({ message: "Error en la petición" });

                    } else {
                        if (!songRemove) {
                            res.status(404).send({ message: "La lista de musica no se puedo borrar" })
                        } else {
                            res.status(200).send({
                                album: albumRemove,
                                song: songRemove
                            })


                        }
                    }
                });


            }
        }
    });


}

function uploadImage(req, res){
    let albumId = req.params.id;
    let file_name = "No subido..";

    if(req.files){
        let file_path = req.files.image.path;
        let file_split = file_path.split('\\');
        let file_name = file_split[3];

        let file_ext = file_name.split('.');
        

        if(file_ext[1] == 'png' || file_ext[1] == 'jpg' || file_ext[1] == 'jpge' || file_ext[1] == 'gif'){
            Album.findByIdAndUpdate(albumId, {image : file_name},{useFindAndModify: false},(err, albumUpload)=>{
                if(!albumUpload){
                    res.status(401).send({ message : "No se ha podido subir la imagen del album"});
                }else{
                    res.status(200).send({ artist : albumUpload});
                } 
            });
        }else{
            res.status(401).send({
                message : "Extencion de archivo no valida"
            }); 
        }
    }
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/artist/album/'+imageFile;
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
    saveAlbum,
    getAlbum,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}