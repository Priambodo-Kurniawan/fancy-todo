'use strict'
require('dotenv').config();
const secret = process.env.TOKEN_SECRET;
const saltRounds = 10

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var User = require('../models/user');
var methods = {}

// mongoose.Promise = global.Promise;

methods.login = (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username})
  .then(user => {
    if(user == null){
      res.send('no such user')
    } else {
      bcrypt.compare(password, user.password)
      .then(result => {
        if(result) {
          var token = jwt.sign({id: user.id, email: user.email, username: user.username}, secret);
          res.send(token);
        } else {
          console.log(result);
          res.send("password is incorrect");
        }
      })
      .catch(err => console.log(err))
    }
  })
  .catch(err => console.log(err))
}

methods.loginFB = (req, res) => {
  var email = req.body.email;

  User.findOne({email: email})
  .then(user => {
    if(user !== null){
      var token = jwt.sign({id: user.id, email:user.email, username:user.username}, secret);
      res.send(token);
    } else {
      var salt = bcrypt.genSaltSync(saltRounds);
      var hash = bcrypt.hashSync('accountfb', salt);
      console.log('create new account');
      var newFBUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        fb_account: true
      })
      console.log(newFBUser);
      newFBUser.save((err, user) => {
        if(err) {
          console.log(err);
          res.send(err.erros)
        } else {
          console.log(user);
          res.send(user)
        }
      })
    }
  })
  .catch(err => console.log(err))
}

methods.signup = (req, res) => {
  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(req.body.password, salt);

  User.create({
    username: req.body.username,
    password: hash,
    email: req.body.email,
    fb_account: false
  })
  .then(response => {
    res.send('User created');
    console.log(response);
  })
  .catch(err => {
    console.log(err);
    if(/username/.test(err.message)){
      res.send('username already taken')
    }
    else if(/email_1/.test(err.message)){
      res.send('email is already registered')
    }
    else {
      res.send(err.message)
    }
  })
}

methods.authUser = (req, res, next) => {
  let token = req.headers.token
  jwt.verify(token, secret, (err, decoded) => {
    if(decoded.id == req.params.id){
      req.body.token = token;
      next()
    } else {
      res.send('not authorized')
    }
  })
}

methods.allUser = (req, res, next) => {
  let token = req.headers.token
  jwt.verify(token, secret, (err, decoded) => {
    if(decoded){
      req.body.token = token;
      next()
    } else {
      res.send('not authorized')
    }
  })
}

module.exports = methods
