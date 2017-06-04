require('dotenv').config();
const secret = process.env.TOKEN_SECRET;
const saltRounds = 10

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var User = require('../models/user');
var methods = {}

mongoose.Promise = global.Promise;

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
          res.send(result);
        }
      })
      .catch (err => console.log(err))
    }
  })
  .cathc(err => console.log(err))
}

var loginFB = (req, res) => {
  var email = req.body.email;

  User.findOne({email: email})
  .then(user => {
    if(user.fb_account){
      var token = jwt.sign({id: user.id, email:user.email, username:user.username}, secret);
      res.send(token);
    } else {
      var salt = bcrypt.genSaltSync(saltRounds);
      var hash = bcrypt.hashSync('accountfb', salt);

      var newFBUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        fb_account: true
      })
      newFBUser.save((err, user) => {
        if(err) {
          res.send(err.erros)
        } else res.send(user)
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
    res.send(err.message)
  })
}

methods.authUser = (req, res, next) => {
  jwt.verify(token, secret, (err, decoded) => {
    if(decoded.id == req.params.id){
      req.body.token = token;
      next()
    } else {
      res.send(err)
    }
  })
}

methods.allUser = (req, res, next) {
  jwt.verify(token, secret, (err, decoded) => {
    if(decoded){
      req.body.token = token;
      next()
    } else {
      res.send(err)
    }
  })
}

module.exports = methods
