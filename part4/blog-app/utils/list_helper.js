const _ = require("lodash");
const Blog = require("../model/blog");

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs) =>
  blogs.length === 0
    ? null
    : blogs.reduce((prev, curr) => (prev.likes > curr.likes ? prev : curr));

const mostBlogs = (blogs) =>
  _.chain(blogs)
    .groupBy("author")
    .map((value, key) => ({ author: key, blogs: value.length }))
    .maxBy("blogs")
    .value();

const mostLikes = (blogs) =>
  _.chain(blogs)
    .groupBy("author")
    .map((value, key) => ({ author: key, likes: _.sumBy(value, "likes") }))
    .maxBy("likes")
    .value();

const listWithOneBlog = [
  {
    title: "Code Solution Zone",
    author: "Laura Miller",
    url: "https://www.codesolutionzone.com",
    likes: 201,
    user: {
      username: "Kumaran",
      name: "kumaran07",
      id: "673ec1024f0e5855afd03110",
    },
    id: "673ef66dff8f695903b5e065",
  },
];

const listWithMultipleBlogs = [
  {
    title: "Code Solution Zone",
    author: "Laura Miller",
    url: "https://www.codesolutionzone.com",
    likes: 201,
    user: {
      username: "Kumaran",
      name: "kumaran07",
      id: "673ec1024f0e5855afd03110",
    },
    id: "673ef66dff8f695903b5e065",
  },
  {
    title: "Dev Trends and Tips",
    author: "Mark Johnson",
    url: "https://www.devtrendsandtips.com",
    likes: 320,
    user: {
      username: "Kumaran",
      name: "kumaran07",
      id: "673ec1024f0e5855afd03110",
    },
    id: "673f0234e56c55807cae9df8",
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    user: {
      username: "Shathish",
      name: "shathish Kumaran",
      id: "673f04abfd74fd05f9632e1f",
    },
    id: "673f0621fd74fd05f9632e33",
  },
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    user: {
      username: "Shathish",
      name: "shathish Kumaran",
      id: "673f04abfd74fd05f9632e1f",
    },
    id: "673f0648fd74fd05f9632e37",
  },
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    user: {
      username: "Kumaran",
      name: "shathish Kumaran",
      id: "673f04abfd74fd05f9632e1f",
    },
    id: "673f0648fd74fd05f9632e37",
  },
];

const listWithUsers = [
  {
    username: "Kumaran",
    password: "Kumaran@07",
    name: "shathish Kumaran",
  },
  {
    username: "Shathish",
    password: "Shathish@07",
    name: "shathish Kumaran",
  },
];

const blogInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const validUser = {
  username: "testuser",
  passwordHashed: "hashedpassword",
  name: "Test User",
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  listWithOneBlog,
  listWithMultipleBlogs,
  blogInDB,
  validUser,
  listWithUsers,
};
