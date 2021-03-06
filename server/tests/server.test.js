const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");
const { User } = require("./../models/user");
const { todos, populateTodos, users, populateUsers } = require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos", () => {
  it("Should create a new todo", done => {
    const text = "Test todo text";

    request(app)
      .post("/todos")
      .set("x-auth", users[0].tokens[0].token)
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((error, res) => {
        if (error) {
          return done(error);
        }

        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(error => done(error));
      });
  });

  it("Should not create todo with invalid body data", done => {
    request(app)
      .post("/todos")
      .set("x-auth", users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((error, res) => {
        if (error) {
          return done(error);
        }

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(error => done(error));
      });
  });
});

describe("GET /todos", () => {
  it("Should get all todos", done => {
    request(app)
      .get("/todos")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe("GET /todos:id", () => {
  it("Should return todo doc", done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it("Should not return todo doc created by other user", done => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("Should return 404 if todo not found", done => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("Should return 404 for non-object ids", done => {
    request(app)
      .get("/todos/123")
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe("DELETE /todos/:id", () => {
  it("should remove a todo", done => {
    const hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((error, res) => {
        if (error) {
          return done(error);
        }

        Todo.findById(hexId)
          .then(doc => {
            expect(doc).toBeFalsy();
            done();
          })
          .catch(error => done(error));
      });
  });

  it("should not remove a todo created by other user", done => {
    const hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end((error, res) => {
        if (error) {
          return done(error);
        }

        Todo.findById(hexId)
          .then(doc => {
            expect(doc).toBeTruthy();
            done();
          })
          .catch(error => done(error));
      });
  });

  it("should return 404 if todo not found", done => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("should return 404 if object id is invalid", done => {
    request(app)
      .delete("/todos/123")
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe("PATCH /todos/:id", () => {
  it("should update the todo", done => {
    const id = todos[0]._id.toHexString();
    const text = "another text";

    request(app)
      .patch(`/todos/${id}`)
      .set("x-auth", users[0].tokens[0].token)
      .send({ text, completed: true })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBeTruthy();
        expect(typeof res.body.todo.completedAt).toBe("number");
      })
      .end(done);
  });

  it("should not update the todo created by other user", done => {
    const id = todos[0]._id.toHexString();
    const text = "another text";

    request(app)
      .patch(`/todos/${id}`)
      .set("x-auth", users[1].tokens[0].token)
      .send({ text, completed: true })
      .expect(404)
      .end(done);
  });

  it("should clear completedAt when todo is not completed", done => {
    const id = todos[1]._id.toHexString();
    const text = "another text!!";

    request(app)
      .patch(`/todos/${id}`)
      .set("x-auth", users[1].tokens[0].token)
      .send({ text, completed: false })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBeFalsy();
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done);
  });
});

describe("GET /users/me", () => {
  it("Should return user if authonticated", done => {
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it("Should return 401 if not authonticated", done => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe("POST /users", () => {
  it("Should create a user", done => {
    const email = "example@example.com";
    const password = "123mnb!";

    request(app)
      .post("/users")
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.header["x-auth"]).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end(error => {
        if (error) {
          return done(error);
        }
        User.findOne({ email })
          .then(user => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
            done();
          })
          .catch(error => done(error));
      });
  });

  it("Should return validation error if request invalid", done => {
    const email = "asdf";
    const password = "l";

    request(app)
      .post("/users")
      .send({ email, password })
      .expect(400)
      .end(done);
  });

  it("Should not create user if email in use", done => {
    const email = users[0].email;
    const password = "12345678";

    request(app)
      .post("/users")
      .send({ email, password })
      .expect(400)
      .end(done);
  });
});

describe("POST /users/login", () => {
  it("Should login user and return auth token", done => {
    const email = users[1].email;
    const password = users[1].password;

    request(app)
      .post("/users/login")
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.header["x-auth"]).toBeTruthy();
      })
      .end((error, res) => {
        if (error) return done(error);

        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens[1]).toMatchObject({
              access: "auth",
              token: res.header["x-auth"]
            });
            done();
          })
          .catch(error => done(error));
      });
  });

  it("Should reject invalid login", done => {
    const email = users[1].email;
    const password = "kfjaslkdfj";

    request(app)
      .post("/users/login")
      .send({ email, password })
      .expect(400)
      .expect(res => {
        expect(res.header["x-auth"]).toBeFalsy();
      })
      .end((error, res) => {
        if (error) return done(error);

        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens.length).toBe(1);
            done();
          })
          .catch(error => done(error));
      });
  });
});

describe("DELETE /users/me/token", () => {
  it("Should remove auth token on logout", done => {
    request(app)
      .delete("/users/me/token")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.header["x-auth"]).toBeFalsy();
      })
      .end((error, res) => {
        if (error) return done(error);

        User.findById(users[0]._id)
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(error => done(error));
      });
  });
});
