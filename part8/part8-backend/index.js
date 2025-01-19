require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const typeDefs = require("./graphql/gqlSchema");
const resolvers = require("./graphql/gqlResolver");
const { User } = require("./model/dbSchema");

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) =>
    console.error("Error connecting to MongoDB:", error.message)
  );

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const authorization = req.headers.authorization;
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
      const token = authorization.substring(7);
      if (!token) return {};
      try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        if (!decodedToken.id) return {};

        const currentUser = await User.findById(decodedToken.id);
        return currentUser;
      } catch (error) {
        return {};
      }
    }
    return {};
  },
});

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 },
})
  .then(({ url }) => console.log(`Server ready at ${url}`))
  .catch((error) => console.error(error));
