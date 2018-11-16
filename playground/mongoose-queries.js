const { ObjectID } = require("mongodb");

const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");
const { User } = require("./../server/models/user");

// const id = "5beec7725750891a3ba9ab0911";

// if (!ObjectID.isValid(id)) {
//   console.log("Id not valid");
// }

// Todo.find({
//   _id: id
// }).then(todos => {
//   console.log("Todos", todos);
// });

// Todo.findOne({
//   _id: id
// }).then(todo => {
//   console.log("Todo", todo);
// });

// Todo.findById(id)
//   .then(todo => {
//     if (!todo) {
//       return console.log("Id not found");
//     }
//     console.log("Todo By Id", todo);
//   })
//   .catch(error => console.log(error));

User.findById("5bedfefe6b93d92e27963697")
  .then(user => {
    if (!user) {
      return console.log("User not found");
    }
    console.log(user);
  })
  .catch(error => console.log(error));
