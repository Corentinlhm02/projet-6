const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Plugin pour garantir l'unicité de l'e-mail
// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
