import mongoose from "mongoose";

const db = "mongodb://mongodb:27017/todoapp";

const connectDb = () => {
  return mongoose
    .connect(db)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log("MongoDB connection error:", err);
    });
};

export default connectDb;