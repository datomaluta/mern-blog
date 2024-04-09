const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// datomaluta
// 7U9jf9ehrOGTnJ0U

// mongodb+srv://datomaluta:7U9jf9ehrOGTnJ0U@mern-blog.buhnglk.mongodb.net/?retryWrites=true&w=majority&appName=mern-blog
