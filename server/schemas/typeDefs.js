const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String
    password: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    _id: ID
    bookId: String!
    authors: [String]!
    description: String!
    title: String!
    image: String
    link: String

  }
  # Set up an Auth type to handle returning data from a profile creating or user login
  type Auth {
    token: ID!
    user: User
  }

  type Query {
   users: [User]
   user(userId: ID!): User
   # user(username: String!): User
   # Because we have the context functionality in place to check a JWT and decode its data, we can use a query that will always find and return the logged in user's data
   me: User
  }

  # Define which mutations the client is allowed to make
  type Mutation {
    # Set the required fields for new User
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(authors: [String]!, description: String!, title: String!, bookId: String!, image: String, link: String): User
    removeBook(bookId: String!): User
  }
`;



module.exports = typeDefs;