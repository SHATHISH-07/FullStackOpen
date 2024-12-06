const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app"); // Your main app file
const User = require("../model/user");
const Blog = require("../model/blog");
const bcrypt = require("bcrypt");
const { test, after, describe, beforeEach } = require("node:test");
const assert = require("assert");

const api = supertest(app);

describe("Blog API", () => {
  let token;

  beforeEach(async () => {
    await Blog.deleteMany({});
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

    const savedUser = await user.save();

    const loginResponse = await api
      .post("/api/login")
      .send({ username: newUser.username, password: newUser.password });
    token = loginResponse.body.token;
  });

  test("POST /api/blogs - create a new blog", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "John Doe",
      url: "http://testblog.com",
      likes: 5,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.title, newBlog.title);
    assert.strictEqual(response.body.author, newBlog.author);
    assert.strictEqual(response.body.url, newBlog.url);
    assert.strictEqual(response.body.likes, newBlog.likes);
  });

  test("DELETE /api/blogs/:id - delete a blog", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "John Doe",
      url: "http://testblog.com",
      likes: 5,
    };

    const blogResponse = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog);

    await api
      .delete(`/api/blogs/${blogResponse.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, 0);
  });

  test("GET /api/blogs - fetch all blogs", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "John Doe",
      url: "http://testblog.com",
      likes: 5,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog);

    const blogsResponse = await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${token}`);

    assert.strictEqual(blogsResponse.body.length, 1);
    assert.strictEqual(blogsResponse.body[0].title, newBlog.title);
    assert.strictEqual(blogsResponse.body[0].author, newBlog.author);
    assert.strictEqual(blogsResponse.body[0].url, newBlog.url);
    assert.strictEqual(blogsResponse.body[0].likes, newBlog.likes);
  });

  test("UPDATE /api/blogs/:id - update a blog", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "John Doe",
      url: "http://testblog.com",
      likes: 5,
    };

    const blogResponse = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog);

    const updatedBlog = {
      title: "Test Blog Updated",
      author: "John Doe",
      url: "http://testblog.com",
      likes: 7,
    };

    const response = await api
      .put(`/api/blogs/${blogResponse.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedBlog);

    const blogsAtEnd = await Blog.find({});

    assert.strictEqual(blogsAtEnd.length, 1);
    assert.strictEqual(blogsAtEnd[0].title, updatedBlog.title);
    assert.strictEqual(blogsAtEnd[0].author, updatedBlog.author);
    assert.strictEqual(blogsAtEnd[0].url, updatedBlog.url);
    assert.strictEqual(blogsAtEnd[0].likes, updatedBlog.likes);
  });
});

after(async () => {
  mongoose.disconnect();
});
