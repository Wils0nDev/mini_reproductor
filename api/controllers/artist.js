'use strict'
const { response } = require('express');
let Artist = require('../models/artist');
let Album = require('../models/album');
let Song = require ('../models/song');
/*para poder obtener los ficheros */
var fs = require('fs');
var path = require('path');

//para hacer paginacion
let mongoosePaginate = require('mongoose-pagination')

function saveArtist(req, res){
    let artist = new Artist();
    
    let params = req.body;

    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err,artistStored)=>{
        if(err){
            res.status(500).send({ message : "Error al guardar el artista" });

        }else{
            if(!artistStored){
                res.status(404).send({ message : "El artista no ha sido guardado" });

            }else{
                res.status(200).send({ artist : artistStored });
            }
        }
    });
    
}

function getArtist(req, res){

    let idArtist = req.params.id;

    Artist.findById(idArtist,(err,artist)=>{
        if(err){
            res.status(404).send({message : "No se pudo obtener al artista"});
        }else{
            if(!artist){
                res.status(404).send({message : "No existe artista"})

            }else{
                res.status(200).send({
                    artist : artist
                });  

            }
        }
    });

    
}

function getAllArtist(req, res){


    Artist.find((err,artists, total)=>{
        if(err){
            res.status(500).send({message:"Error en la petición"});
        }else{
            if(!artists){
                res.status(404).send({message : "No hay artistas"})

            }else{
                res.status(200).send({
                    total_items : total,
                    artist : artists
                });  

            }
        }
    } );
  

    
}

function getArtistPage(req, res){

    //numero de pagina, no de elementos
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;

    }
    
    /*total de items q sacara en un inicio*/
    let itemPerPage = 3; //mostrara 3 elementos por pagina

    Artist.find().sort('name').paginate(page,itemPerPage,(err,artists, total)=>{
        if(err){
            res.status(500).send({message:"Error en la petición"});
        }else{
            if(!artists){
                res.status(404).send({message : "No hay artistas"})

            }else{
                res.status(200).send({
                    total_items : total,
                    artist : artists
                });  

            }
        }
    } );
  

    
}

function updateArtist(req, res){

    let idArtist = req.params.id;
    let update = req.body;
    Artist.findByIdAndUpdate(idArtist,update,{useFindAndModify: false},(err, artisUpdate)=>{
        if(err){
            res.status(500).send({message:"Error en la petición"});

        }else{
            if(!artisUpdate){
                res.status(404).send({message : "El artista no existe"})

            }else{
                res.status(200).send({artist : artisUpdate})

            }
        }
    })

}

function deleteArtist(req, res){

    var artistId = req.params.id

    Artist.findByIdAndRemove(artistId,{useFindAndModify: false},(err,artistRemove)=>{
        if(err){
            res.status(500).send({message:"Error en la petición"});

        }else{
            if(!artistRemove){
                res.status(404).send({message : "El artista no se puede borrar"})

            }else{
                let artistId = artistRemove._id
                Album.find({artist : artistId}).deleteMany((err,albumRemove)=>{
                    if(err){
                        res.status(500).send({message:"Error en la petición"});
            
                    }else{
                        if(!albumRemove){
                            res.status(404).send({message : "El album no se puedo borrar"})
                    }else{
                        let albumId = albumRemove._id
                        Song.find({album : albumId}).deleteMany((err,songRemove)=>{
                            if(err){
                                res.status(500).send({message:"Error en la petición"});
                    
                            }else{
                                if(!songRemove){
                                    res.status(404).send({message : "La cancion no se puedo borrar"})
                            }else{
                                res.status(200).send({
                                    artist : artistRemove,
                                    album : albumRemove,
                                    song : songRemove
                                })

                            }
                        }
                        });
        
        
                    }
                    }
                });


            }
        }
    });

}

function uploadImage(req, res){
    let artistId = req.params.id;
    let file_name = "No subido..";

    if(req.files){
        let file_path = req.files.image.path;
        let file_split = file_path.split('\\');
        let file_name = file_split[2];

        let file_ext = file_name.split('.');

        if(file_ext[1] == 'png' || file_ext[1] == 'jpg' || file_ext[1] == 'jpge' || file_ext[1] == 'gif'){
            Artist.findByIdAndUpdate(artistId, {image : file_name},{useFindAndModify: false},(err, artistUpdate)=>{
                if(!artistUpdate){
                    res.status(401).send({ message : "No se ha podido actulizar el artista"});
                }else{
                    res.status(200).send({ artist : artistUpdate});
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
    var path_file = './uploads/artist/'+imageFile;
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
    saveArtist,
    getAllArtist,
    getArtist,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile,
    getArtistPage
}