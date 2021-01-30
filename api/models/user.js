'use strict'

const moongose = require('mongoose');
let Schema = moongose.Schema;

let UserSchema = Schema({
    name : String,
    surname : String,
    email: String,
    password: String,
    role : String,
    image : String
});

module.exports = moongose.model('User', UserSchema);