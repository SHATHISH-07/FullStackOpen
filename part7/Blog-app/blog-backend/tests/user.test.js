const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app"); // Your main app file
const User = require("../model/user");
const { test, after, describe, beforeEach } = require("node:test");
const assert = require("assert");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
});

describe("User API", () => {
  test("GET /api/users - fetch all users", async () => {
    const response = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.length, 0);
  });

  test("POST /api/users - create a new user", async () => {
    const newUser = {
      username: "testuser",
      password: "testpass",
      name: "Test User",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, 1);
    assert.strictEqual(usersAtEnd[0].username, newUser.username);
  });

  test("POST /api/users - username must be unique", async () => {
    const newUser = {
      username: "testuser",
      password: "testpass",
      name: "Test User",
    };

    await api.post("/api/users").send(newUser);
    const result = await api.post("/api/users").send(newUser);

    assert.strictEqual(result.status, 400);
    assert.strictEqual(result.body.error, "Username already exists");
  });

  test("POST /api/users - password validation", async () => {
    const newUser = {
      username: "testuser",
      password: "12",
      name: "Test User",
    };

    const result = await api.post("/api/users").send(newUser);
    assert.strictEqual(result.status, 400);
    assert.strictEqual(
      result.body.error,
      "Password must be at least 3 characters long"
    );
  });

  test("POST /api/users - username must be at least 3 characters long", async () => {
    const newUser = {
      username: "te",
      password: "testpass",
      name: "Test User",
    };

    const result = await api.post("/api/users").send(newUser);
    assert.strictEqual(result.status, 400);
    assert.strictEqual(
      result.body.error,
      "Username must be at least 3 characters long"
    );
  });
});

after(async () => {
  await mongoose.disconnect();
});
