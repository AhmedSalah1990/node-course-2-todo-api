require("./config/config");

const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const _ = require("lodash");

const { mongoose } = require("./db/mongoose");
const { Todo } = require("./models/todo");
const { User } = require("./models/user");
const { authonticate } = require("./middleWare/authonticate");

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post("/todos", (req, res) => {
  const todo = new Todo({
    text: req.body.text
  });

  todo.save().then(
    doc => {
      res.send(doc);
    },
    error => {
      res.status(400).send(error);
    }
  );
});

app.get("/todos", (req, res) => {
  Todo.find().then(
    todos => {
      res.send({
        todos
      });
    },
    error => {
      res.status(400).send(error);
    }
  );
});

app.get("/todos/:id", (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({ todo });
    })
    .catch(error => {
      res.status(400).send();
    });
});

app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndDelete(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch(error => {
      res.status(400).send();
    });
});

app.patch("/todos/:id", (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ["text", "completed"]);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(
    id,
    {
      $set: body
    },
    { new: true }
  )
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch(error => res.status(400).send());
});

// POST users
app.post("/users", (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);
  const newUser = new User(body);

  newUser
    .save()
    .then(() => {
      return newUser.generateAuthToken();
    })
    .then(token => {
      res.header("x-auth", token).send(newUser);
    })
    .catch(error => {
      if (error.name && error.name === "ValidationError") {
        const errorMsg = {};
        for (let key in error.errors) {
          if (error.errors.hasOwnProperty(key)) {
            errorMsg[key] = error.errors[key].message;
          }
        }
        return res.status(400).send(errorMsg);
      }
      res.status(400).send(error);
    });
});

app.get("/users/me", authonticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login (email, password)
app.post("/users/login", (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);

  User.findByCredentials(body.email, body.password)
    .then(user => {
      user.generateAuthToken().then(token => {
        res.header("x-auth", token).send(user);
      });
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {
  app
};
