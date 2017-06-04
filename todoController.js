var Todo = require('../models/todo');
var util = requier('../helpers/util');

methods.get = (req, res) => {
  util.userInfo(req.body.token, function(result){
    Todo.find({creator: result.id}, (err, todos) => {
      res.send(todos)
    })
  }
}

methods.create = (req, res) => {
  var task = req.body.task;
  util.userInfo(req.body.token, function(result){
    Todo.create({
      task: task;
      creator: result.id,
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
  util.userInfo(req.body.token, function(result) {
    Todo.findById(req.params.id)
    .then(todo =>{
      if(todo.creator == result.id){
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
  util.userInfo(req.body.token, function(result){
    Todo.findById(req.params.id)
    .then(todo => {
      if(todo.creator == result.id){
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
