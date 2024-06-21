const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");
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

// __dirname = path.resolve();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

// app.use("*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
// });

app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use(globalErrorHandler);

// app.use(globalErrorHandler);

// datomaluta
// 7U9jf9ehrOGTnJ0U

// mongodb+srv://datomaluta:7U9jf9ehrOGTnJ0U@mern-blog.buhnglk.mongodb.net/?retryWrites=true&w=majority&appName=mern-blog
