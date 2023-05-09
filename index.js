const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.port || 5000;
var cors = require("cors");

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tewydk3.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("coffeeDB");
    const chocolateCollection = database.collection("chocolate");

    app.get("/chocolates", async (req, res) => {
      const cursor = chocolateCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/chocolates/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await chocolateCollection.findOne(query);
      res.send(result);
    });

    app.post("/chocolates", async (req, res) => {
      const newChocolate = req.body;
      console.log(newChocolate);
      const result = await chocolateCollection.insertOne(newChocolate);
      res.send(result);
    });

    app.put("/chocolates/:id", async (req, res) => {
      const id = req.params.id;
      const Chocolate = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateChocolate = {
        $set: {
          name: Chocolate.name,
          country: Chocolate.country,
          option: Chocolate.option,
        },
      };
      const result = await chocolateCollection.updateOne(
        filter,
        updateChocolate,
        options
      );
      res.send(result);
    });

    app.delete("/chocolates/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id, "deleted");
      const query = { _id: new ObjectId(id) };
      const result = await chocolateCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello chocolate World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
