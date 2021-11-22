const port = 4000;
const express = require("express");
const app = express();
const { graphqlHTTP } = require("express-graphql"); //==>this middleware allow express to understand graphql and
// provide a way to use graphql
const schema = require("./schema/schema");

// .....................................
// connect to mongodb with mongoose
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://suresh47:test123@cluster0.rxtkh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);
mongoose.connection.once("open", () => {
  console.log("connected to db");
});
// ...................................

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
// mongodb+srv://suresh47:<password>@cluster0.rxtkh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
