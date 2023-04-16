const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

//EC: Import the ApolloServer class
const { ApolloServer } = require('apollo-server-express');

// Import the two parts of a GraphQL schema
const { typeDefs, resolvers } = require('./schemas');


const app = express();
const PORT = process.env.PORT || 3001;

//EC: add Apolloserver
const server = new ApolloServer({
  typeDefs,
  resolvers
});

//TODO: find out - maybe change to 'false'?
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}


//TODO: ?? do not need that
// app.use(routes);


//TODO: ?? do not need that
// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });

//EC: Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  //EC: here we waiting for Apolloserver spin up first, make sure that works, then we gona apply our Middleware
  await server.start();
  //EC: express now a Middleware for Apollo. So express has some additional staff
  server.applyMiddleware({ app });
  //EC: connect to our database
  db.once('open', () => {
    //EC: starts the app listening
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
  };
  
  //EC: Call the async function to start the server
  startApolloServer(typeDefs, resolvers);
