'use strict'

const moongose = require('mongoose');
let Schema = moongose.Schema;

let UserSchema = Schema({
    name : String,
    surname : String,
    email: { type: String, required: true, unique: true },
    password: String,
    role : String,
    image : String
});

module.exports = moongose.model('User', UserSchema);