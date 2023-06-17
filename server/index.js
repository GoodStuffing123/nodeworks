const express = require("express");
const expressRateLimit = require("express-rate-limit");
require("dotenv").config();
// const http = require("http");
const routes = require("./routes/routes.js");

const app = express();
const port = process.env.PORT || "8080";

if (process.env.ENVIRONMENT !== "development") {
  app.use(expressRateLimit({
    windowMs: 1000 * 60,
    max: 6,
  }));
}

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("accept", "application/json");

  next();
});

routes(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
