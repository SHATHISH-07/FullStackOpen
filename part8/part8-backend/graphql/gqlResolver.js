require("dotenv").config();
const { UserInputError, AuthenticationError } = require("apollo-server-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Author, Book, User } = require("../model/dbSchema");

const JWT_SECRET = process.env.JWT_SECRET;

const resolvers = {
  Query: {
    bookCount: () => Book.countDocuments(),
    authorCount: () => Author.countDocuments(),
    allBooks: async (root, args) => {
      let filter = {};
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) filter.author = author._id;
      }
      if (args.genre) filter.genres = args.genre;
      return Book.find(filter).populate("author");
    },
    allAuthors: async () => {
      const authors = await Author.find({});
      const books = await Book.find({});
      return authors.map((author) => ({
        ...author.toObject(),
        bookCount: books.filter(
          (book) => book.author.toString() === author._id.toString()
        ).length,
      }));
    },
    me: (root, args, currentUser) => {
      if (!currentUser) {
        throw new AuthenticationError("Not authenticated");
      }
      return currentUser;
    },
  },

  Mutation: {
    addBook: async (root, args, currentUser) => {
      if (!currentUser) {
        throw new AuthenticationError("Not authenticated");
      }

      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        await author.save();
      }

      const book = new Book({ ...args, author: author._id });
      try {
        await book.save();
        return book.populate("author");
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }
    },
    editAuthor: async (root, args, currentUser) => {
      if (!currentUser) {
        throw new AuthenticationError("Not authenticated");
      }

      const author = await Author.findOne({ name: args.name });
      if (!author) return null;

      author.born = args.setBornTo;
      try {
        await author.save();
        return author;
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }
    },
    createUser: async (root, args) => {
      const passwordHash = await bcrypt.hash(args.password, 10);
      const user = new User({ ...args, passwordHash });
      try {
        await user.save();
        return user;
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      const passwordCorrect =
        user && (await bcrypt.compare(args.password, user.passwordHash));

      if (!user || !passwordCorrect) {
        throw new UserInputError("Invalid username or password");
      }

      const userForToken = { username: user.username, id: user._id };
      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
};

module.exports = resolvers;
