const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto')
const config = require('../config')

const User = new Schema({
    username: {type:String, default: null},
    password: {type:String, default: null},
    admin: { type: Boolean, default: false }
})

User.statics.create = function(username, password) {
    const encrypted = crypto.createHmac('sha512', config.SECRET)
                    .update(password)
                    .digest('base64')
    console.log(password, encrypted);
    const user = new this({
        username,
        password : encrypted
    });
    return user.save()
}

User.statics.findOneByUsername = function(username) {
    return this.findOne({
        username
    }).exec()
}

User.methods.verify = function(password) {
    const encrypted = crypto.createHmac('sha512', config.SECRET)
                      .update(password)
                      .digest('base64')
    console.log(this.password === encrypted);
    return this.password === encrypted;
}

User.methods.assignAdmin = function(){
    this.admin = true;
    return this.save();
}

module.exports = mongoose.model('User', User)