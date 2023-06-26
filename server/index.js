const express = require("express");
const expressRateLimit = require("express-rate-limit");
const routes = require("./routes/routes.js");

const app = express();
const port = process.env.PORT || "9000";

if (process.env.NODE_ENV !== "development") {
  console.log("Limit set!");
  app.use(expressRateLimit({
    windowMs: 1000 * 60,
    max: 6,
  }));
}

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://nodeworks.netlify.app");

  next();
});

routes(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
