const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Comment = require("./models/Comment"); // Import the model

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // Enable JSON body parsing

const uri = process.env.MONGO_URI; // MongoDB URI from .env file

// Connect to MongoDB with Mongoose
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error: ", err));

// Home route
app.get("/", async (req, res) => {
  res.send({ message: "MongoDB API is running!" });
});

// Get all comments
app.get("/comments", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving comments" });
  }
});

// Get a single comment by ID
app.get("/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving comment" });
  }
});

// Create a new comment
app.post("/comments", async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ error: "Error creating comment" });
  }
});

// Update a comment
app.put("/comments/:id", async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedComment) return res.status(404).json({ error: "Comment not found" });
    res.json(updatedComment);
  } catch (err) {
    res.status(400).json({ error: "Error updating comment" });
  }
});

// Delete a comment
app.delete("/comments/:id", async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    if (!deletedComment) return res.status(404).json({ error: "Comment not found" });
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting comment" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// const express = require("express");
// const { MongoClient } = require("mongodb");
// require("dotenv").config();  // Load environment variables

// const app = express();
// const uri = process.env.MONGO_URI; // Get MongoDB URI from environment variable

// let db;
// MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then((client) => {
//     db = client.db("sample_mflix");  // Change "mydatabase" to your actual DB name
//     console.log("Connected to MongoDB Atlas");
//   })
//   .catch((err) => console.error("MongoDB connection error: ", err));

// app.get("/", async (req, res) => {
//   try {
//     const collection = db.collection("comments");
//     const result = await collection.findOne({});
//     res.send(result || { message: "No data found" });
//   } catch (err) {
//     res.status(500).send("Error connecting to database");
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
