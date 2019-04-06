const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const { graphiqlExpress, graphqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
const Job = require("./Models/Job");
const Interview = require("./Models/Interview");
const User = require("./Models/User");

const { typeDefs } = require("./schema.js");
const { resolvers } = require("./resolvers.js");

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log("connected to the database"))
  .catch(err => console.error(err));

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);

// set up jwt auth middleware
// app.use(async (req, res, next) => {
//   const token = req.headers["authorization"];
//   if (token !== "null") {
//     try {
//       const currentUser = await jwt.verify(token, process.env.SECRET);
//       req.currentUser = currentUser;
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   next();
// });

app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress(() => ({
    schema,
    context: {
      Job,
      Interview,
      User
      // currentUser
    }
  }))
);

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
