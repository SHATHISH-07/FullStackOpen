require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const blogRouter = require("./controller/blogs");
const loginRouter = require("./controller/login");
const logger = require("./utils/logger");
const config = require("./utils/config");
const userRouter = require("./controller/users");
const middleware = require("./utils/middleware");
const app = express();

app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", false);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(middleware.tokenExtractor);
app.use("/api/blogs", middleware.userExtractor, blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
