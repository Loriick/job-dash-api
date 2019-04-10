const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const Job = require("./models/Job");
const Interview = require("./models/Interview");
const User = require("./models/User");
const { typeDefs } = require("./schema.js");
const { resolvers } = require("./resolvers.js");

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(console.log("connect to the database"))
  .catch(err => console.error(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async (req, res, next) => {
    const token = req.headers["authorization"];
    if (token !== "null") {
      try {
        const currentUser = await jwt.verify(token, process.env.SECRET);
        req.currentUser = currentUser;
      } catch (error) {
        console.error(error);
      }
    }
    next();
  },
  Job,
  Interview,
  User
});
server.applyMiddleware({ app });

server.listen().then(({ url }) => console.log(`server running on port ${url}`));
