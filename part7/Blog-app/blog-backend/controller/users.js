const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/user");

userRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });

  res.status(200).json(users.map((user) => user.toJSON()));
});

userRouter.post("/", async (req, res) => {
  const { username, password, name } = req.body;

  if (!password || password.length < 3) {
    return res
      .status(400)
      .json({ error: "Password must be at least 3 characters long" });
  }

  // Validate username length
  if (!username || username.length < 3) {
    return res
      .status(400)
      .json({ error: "Username must be at least 3 characters long" });
  }

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "username and password are required" });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: "Username already exists" });
  }

  const saltRounds = 10;
  const passwordHashed = await bcrypt.hash(password, saltRounds);

  const user = new User({ username, passwordHashed, name });

  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser); // Ensure the response is the newly created user
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

module.exports = userRouter;
