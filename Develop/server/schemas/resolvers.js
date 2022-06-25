const { Book, User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("savedBooks");

        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, { email, password, username }) => {
      console.log({ email, username, password });
      const user = await User.create({ email, password, username });
      if (!user) {
        throw new AuthenticationError("Unable to create user");
      }
      console.log({ user });
      return { user };
    },
    saveBook: async (
      parent,
      { authors, description, title, bookId, image, link }
    ) => {
      // adds a book to a users savedBooks array and insert in the arguments provided

      const user = await User.findOneAndUpdate(
        { _id: context.user._id },
        {
          $push: {
            savedBooks: {
              authors,
              description,
              title,
              bookId,
              image,
              link,
            },
          },
        },
        { new: true }
      );
      // const book = await Book.create({
      //   authors,
      //   description,
      //   title,
      //   bookId,
      //   image,
      //   link,
      // });
      // if (!book) {
      //   throw new AuthenticationError("Unable to save book");
      // }
      // // save the book to the user as well
      // const user = await User.findOneAndUpdate(
      //   { _id: context.user._id },
      //   { $push: { savedBooks: book._id } },
      //   { new: true }
      // );
      // if (!user) {
      //   throw new AuthenticationError("Unable to save book to user");
      // }

      return { user };
    },
    removeBook: async (parent, { bookId }) => {
      const book = await Book.deleteOne({ _id: bookId });
      if (!book) {
        throw new AuthenticationError("Unable to remove book");
      }
      const user = await User.findOneAndDelete(
        { _id: context.user._id },
        { $pop: { savedBooks: book._id } }
      );
      if (!user) {
        throw new AuthenticationError("Unable to remove book from user");
      }

      return { book };
    },
  },
};

module.exports = resolvers;
