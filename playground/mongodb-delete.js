const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to MongoDB server", error);
    }
    console.log("Connected to MongoDB server");
    const db = client.db("TodoApp");

    ///////////////////// deleteMany
    // db.collection("Todos")
    //   .deleteMany({ text: "Eat lunch" })
    //   .then(result => {
    //     console.log(result);
    //   });

    ////////////////////// deleteOne
    // db.collection("Todos")
    //   .deleteOne({ text: "Eat lunch" })
    //   .then(result => {
    //     console.log(result);
    //   });

    ////////////////////// findOneAndDelete
    // db.collection("Todos")
    //   .findOneAndDelete({ completed: false })
    //   .then(result => {
    //     console.log(result);
    //   });

    // Challenge
    // db.collection("Users")
    //   .deleteMany({ name: "Ahmed" })
    //   .then(result => {
    //     console.log(result);
    //   });

    db.collection("Users")
      .findOneAndDelete({ _id: new ObjectID("5bed53502b354e12f024e091") })
      .then(result => {
        console.log(result);
      });

    // client.close();
  }
);
