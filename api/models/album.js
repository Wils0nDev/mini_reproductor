'use strict'

const moongose = require('mongoose');
let Schema = moongose.Schema;

let AlbumSchema = Schema({
    title : String,
    description : String,
    year : Number,
    image: String,
    artist: { type:Schema.ObjectId, ref: 'Artist' }
});

module.exports = moongose.model('Album', AlbumSchema);
