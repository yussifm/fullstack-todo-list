import mongoose from "mongoose";

const db = process.env.MONGODB_URI || "mongodb://mongodb:27017/todoapp";

const connectDb = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("MongoDB connection error:", err);
    setTimeout(connectDb, 5000); // Retry after 5 seconds
  }
};

export default connectDb;