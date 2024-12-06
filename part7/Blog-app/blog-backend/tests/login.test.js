const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const { test, after, describe, beforeEach } = require("node:test");
const assert = require("assert");

const api = supertest(app);

describe("Login API", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const newUser = {
      username: "testuser",
      password: "testpass",
      name: "Test User",
    };

    const user = new User({
      username: newUser.username,
      name: newUser.name,
      passwordHashed: await bcrypt.hash(newUser.password, 10),
    });

    await user.save();
  });

  test("POST /api/login - successful login", async () => {
    const loginDetails = {
      username: "testuser",
      password: "testpass",
    };

    const response = await api
      .post("/api/login")
      .send(loginDetails)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.ok(response.body.token);
    assert.strictEqual(response.body.username, loginDetails.username);
  });

  test("POST /api/login - invalid password", async () => {
    const loginDetails = {
      username: "testuser",
      password: "wrongpass",
    };

    const response = await api
      .post("/api/login")
      .send(loginDetails)
      .expect(401);

    assert.strictEqual(response.body.error, "invalid username or password");
  });
});

after(async () => {
  await mongoose.connection.close();
});
