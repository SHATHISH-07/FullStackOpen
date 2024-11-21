const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = express.Router();
const User = require("../model/user");

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const passwordCorrect =
    user !== null && (await bcrypt.compare(password, user.passwordHashed));

  if (!passwordCorrect) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: "1h" });

  response
    .status(200)
    .json({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
