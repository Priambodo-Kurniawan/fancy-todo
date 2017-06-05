var Todo = require('../models/todo');
var util = require('../helpers/util');
var methods = {}

methods.getAll = (req, res) => {
  Todo.find({}, (err, todos) => {
    res.send(todos)
  })
}

methods.get = (req, res) => {
  util.userInfo(req.body.token, function(user){
    Todo.find({creator: user.id}, (err, todos) => {
      res.send(todos)
    })
  })
}

methods.create = (req, res) => {
  var task = req.body.task;
  util.userInfo(req.body.token, function(user){
    Todo.create({
      task: task,
      creator: user.id,
      completed: false,
      tags: req.body.tags
    })
    .then(response => {
      console.log(response);
      res.send('Task added')
    })
    .catch(err => console.log(err))
  })
}

methods.getOne = (req, res) => {
  Todo.find({_id: req.body.id})
  .then(todo => {
    res.send(todo)
  })
  .catch(err => console.log(err))
}

methods.update = (req, res) => {
  util.userInfo(req.body.token, function(user) {
    Todo.findById(req.params.id)
    .then(todo =>{
      if(todo.creator == user.id){
        Todo.update({_id:req.params.id}, req,body)
        .then(()=>{
          res.send('task has been updated')
        })
      } else {
        res.send('not authorized')
      }
    })
    .catch(err => console.log(err))
  })
}

methods.delete = (req, res) => {
  util.userInfo(req.body.token, function(user){
    Todo.findById(req.params.id)
    .then(todo => {
      if(todo.creator == user.id){
        todo.remove()
        .then(()=>{
          res.send('task has been deleted')
        })
        .catch(err => console.log(err))
      } else {
        res.send('not authorized')
      }
    })
  })
}

module.exports = methods
