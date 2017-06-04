var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema ({
  task: {
    type: String,
    required: [true, 'Please enter your task']
  },
  completed: Boolean,
  tags: [{
    type: String
  }],
  creator: {
    type: Schema.Types.ObjectId, ref: 'User'
  }
})

var Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
