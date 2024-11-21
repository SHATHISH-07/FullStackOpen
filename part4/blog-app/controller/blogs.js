const express = require("express");
const Blog = require("../model/blog");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const blogRouter = express.Router();

const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    res.status(200).json(blogs);
  } catch (err) {
    next(err);
  }
};

const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  } catch (err) {
    next(err);
  }
};

const createBlog = async (req, res, next) => {
  try {
    const { title, author, url, likes = 0, userId } = req.body;

    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ error: "token invalid" });
    }
    const user = req.user;

    if (!title || !url) {
      return res.status(400).json({ error: "title and url are required" });
    }

    if (!user) {
      return res.status(400).json({ error: "invalid user" });
    }

    const blog = new Blog({ title, author, url, likes, user: user.id });
    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    res.status(201).json(savedBlog.toJSON());
  } catch (err) {
    next(err);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ error: "token invalid" });
    }
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    if (blog.user.toString() !== decodedToken.id) {
      return res.status(401).json({ error: "unauthorized" });
    }

    const { title, author, url, likes } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, author, url, likes },
      { new: true, runValidators: true, context: "query" }
    );

    if (updatedBlog) {
      res.status(200).json(updatedBlog);
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  } catch (err) {
    next(err);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ error: "token invalid" });
    }
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    if (blog.user.toString() !== decodedToken.id) {
      return res.status(401).json({ error: "unauthorized" });
    }
    await Blog.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

blogRouter.get("/", getBlogs);

blogRouter.get("/:id", getBlog);

blogRouter.post("/", createBlog);

blogRouter.put("/:id", updateBlog);

blogRouter.delete("/:id", deleteBlog);

module.exports = blogRouter;
