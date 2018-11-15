// const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to MongoDB server");
    }
    console.log("Connected to MongoDB server");
    const db = client.db("TodoApp");

    // db.collection("Todos").insertOne(
    //   {
    //     text: "Something to do",
    //     completed: false
    //   },
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert todo", error);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    //   }
    // );

    // db.collection("Users").insertOne(
    //   {
    //     name: "Ahmed",
    //     age: 28,
    //     location: "Gize, Egypt"
    //   },
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert user", error);
    //     }

    //     console.log(
    //       JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2)
    //     );
    //   }
    // );

    client.close();
  }
);
