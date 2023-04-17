const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: String!
    authors: [String]!
    description: String
    title: String!
    image: String
    link: String!

  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
   # user: [User]
   # user(username: String!): User
    me: User
  }

  # Define which mutations the client is allowed to make
  type Mutation {
    # Set the required fields for new User
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(author: [String]!, description: String!, title: String!, bookId: String!, image: String, link: String!): User
    removeBook(bookId: String!): User
  }
`;



module.exports = typeDefs;