'use strict'

const moongose = require('mongoose');
let Schema = moongose.Schema;

let ArtistSchema = Schema({
    name : String,
    description : String,
    image: String,
});

module.exports = moongose.model('Artist', ArtistSchema);
