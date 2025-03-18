const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();  // Load environment variables

const app = express();
const uri = process.env.MONGO_URI; // Get MongoDB URI from environment variable

let db;
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    db = client.db("sample_mflix");  // Change "mydatabase" to your actual DB name
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => console.error("MongoDB connection error: ", err));

app.get("/", async (req, res) => {
  try {
    const collection = db.collection("comments");
    const result = await collection.findOne({});
    res.send(result || { message: "No data found" });
  } catch (err) {
    res.status(500).send("Error connecting to database");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
