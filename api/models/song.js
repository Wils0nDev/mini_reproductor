'use strict'

const moongose = require('mongoose');
let Schema = moongose.Schema;

let SongSchema = Schema({
    number : Number,
    name : String,
    duration : Number,
    fichero: String,
    album: { type:Schema.ObjectId, ref: 'Album' }
});

module.exports = moongose.model('Song', SongSchema);
