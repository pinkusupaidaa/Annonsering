const mongoose = require('mongoose');
mongoose.Promise = Promise;
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};

module.exports.getUserByUsername = function (username, callback) {
    const query = {username: username};
    User.findOne(query, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
};

module.exports.createUser = function (newUser, callback) {
/*    let query = {username: newUser.username};
    User.findOne(query, function (err, user) {
       if(err){
           console.log(err);
       }
       if(user){
           console.log('user already exists');
           console.log(user);
          // return {success: false, msg:'Användarnamnet finns redan'};
       }
       else{
           bcrypt.genSalt(10, (err, salt) =>{
               bcrypt.hash(newUser.password, salt, (err, hash) => {
                   if(err) throw err;
                   newUser.password = hash;
                   newUser.save(callback);
                   //return {success: true, msg:'Användare registrerad'};
               });
           });
       }
    });*/
    bcrypt.genSalt(10, (err, salt) =>{
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
            //return {success: true, msg:'Användare registrerad'};
        });
    });

};