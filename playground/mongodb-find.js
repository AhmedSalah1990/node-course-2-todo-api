const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to MongoDB server", error);
    }
    console.log("Connected to MongoDB server");

    const db = client.db("TodoApp");

    // db.collection("Todos")
    //   .find({
    //     _id: new ObjectID("5bed560cd2bd7b4a229847b3")
    //   })
    //   .toArray()
    //   .then(
    //     docs => {
    //       console.log("Todos");
    //       console.log(JSON.stringify(docs, undefined, 2));
    //     },
    //     error => {
    //       console.log("Unable to fetch todos", error);
    //     }
    //   );
    // db.collection("Todos")
    //   .find({
    //     // _id: new ObjectID("5bed560cd2bd7b4a229847b3")
    //   })
    //   .count()
    //   .then(
    //     count => {
    //       console.log(`Todos count: ${count}`);
    //     },
    //     error => {
    //       console.log("Unable to fetch todos", error);
    //     }
    //   );

    db.collection("Users")
      .find({ name: "Ahmed" })
      .toArray()
      .then(users => {
        console.log("Users");
        console.log(JSON.stringify(users, undefined, 2));
      })
      .catch(err => {
        console.log(err);
      });

    // client.close();
  }
);
