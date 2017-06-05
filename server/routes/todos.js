var express = require('express');
var router = express.Router();
var todo = require('../controllers/todoController')

router.get('/', todo.getAll);

router.get('/todo', todo.get);

// create new task
router.post('/create', todo.create)

// get task by id
router.get('/:id', todo.getOne)

// update task
router.put('/:id', todo.update)

// delete task
router.delete('/:id', todo.delete)



module.exports = router;
