const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/inotebookDatabase";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to Mongo Successfully");
  } catch (err) {
    console.error("Connection failed!", err);
  }
};
module.exports = connectToMongo;
