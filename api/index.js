const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// app.use(express.static("public"));
// app.use("/images", express.static("images"));

app.enable("trust proxy");

app.use(cors());
app.options("*", cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Stripe webhook, BEFORE body-parser, because stripe needs the body as stream
// app.post("/webhook-checkout", bodyParser.raw({ type: "application/json" }));

app.use("/api/users", userRouter);
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});
app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

// app.use(globalErrorHandler);

// datomaluta
// 7U9jf9ehrOGTnJ0U

// mongodb+srv://datomaluta:7U9jf9ehrOGTnJ0U@mern-blog.buhnglk.mongodb.net/?retryWrites=true&w=majority&appName=mern-blog
