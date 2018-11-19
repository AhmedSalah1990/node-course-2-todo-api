const { ObjectID } = require("mongodb");

const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");
const { User } = require("./../server/models/user");

// Todo.deleteMany({}).then(result => {
//   console.log(result);
// });

// Todo.findOneAndRemove()
// Todo.findByIdAndRemove()

Todo.findOneAndRemove({ _id: "5bf304e6a1269f60ad7ddddc" }).then(todo => {
  console.log(todo);
});

Todo.findByIdAndRemove("5bf304e6a1269f60ad7ddddc").then(todo => {
  console.log(todo);
});
