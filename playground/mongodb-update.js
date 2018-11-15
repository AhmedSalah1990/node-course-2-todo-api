const { MongoClient, ObjectId } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to MongoDB server");
    }
    console.log("Connected to MongoDB server");

    const db = client.db("TodoApp");

    // db.collection("Todos")
    //   .findOneAndUpdate(
    //     { _id: new ObjectId("5bed6797d2bd7b4a22984d15") },
    //     { $set: { completed: true } },
    //     { returnOriginal: false }
    //   )
    //   .then(result => {
    //     console.log(result);
    //   });

    db.collection("Users")
      .findOneAndUpdate(
        { _id: new ObjectId("5bed51139f17aa126f841645") },
        {
          $set: { name: "Ahmed" },
          $inc: { age: 1 }
        },
        { returnOriginal: false }
      )
      .then(result => {
        console.log(result);
      });

    // client.close();
  }
);
