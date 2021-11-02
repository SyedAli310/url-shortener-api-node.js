require("dotenv").config();

// extraa security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();
//connectDB
const connectDB = require("./db/connect");
//routers
const urlRouter = require("./routes/url");
const mainRouter = require("./routes/main");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

//routes
app.get("/", (req, res) => {
  res.status(200).send("<h1 style='color:lightgreen; text-align:center;'>URL Shortening</h1>");
});
app.use("/", mainRouter);
app.use("/api/url", urlRouter);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (err) {
    console.log(err);
  }
};

start();
