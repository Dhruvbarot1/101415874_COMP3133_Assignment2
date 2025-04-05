const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const typeDefs = require('./schemas/typeDefs');
const employeeResolvers = require('./resolvers/employeeResolvers');
const authResolvers = require('./resolvers/authResolvers');
const { mergeResolvers } = require('@graphql-tools/merge');

dotenv.config();

const app = express();
app.use(cors());

const resolvers = mergeResolvers([authResolvers, employeeResolvers]);

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;

  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
  });
}

startServer();
