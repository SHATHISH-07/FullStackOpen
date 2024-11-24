const express = require("express");
const resetRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/user");
const Blog = require("../model/blog");

// Only allow the reset route in development mode
if (process.env.NODE_ENV !== "production") {
  resetRouter.post("/", async (req, res) => {
    try {
      // Assuming you're using MongoDB, you can clear the collections like this:
      await User.deleteMany({});
      await Blog.deleteMany({});
      res.status(200).json({ message: "Database reset successful" });
    } catch (error) {
      console.error("Error resetting database:", error);
      res.status(500).json({ error: "Failed to reset database" });
    }
  });
}

module.exports = resetRouter;
