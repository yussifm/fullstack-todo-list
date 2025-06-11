import mongoose from "mongoose";

console.log("=== DEBUG INFO ===");
console.log("Environment MONGODB_URI:", process.env.MONGODB_URI);
console.log("All env keys containing MONGO:", Object.keys(process.env).filter(key => key.includes('MONGO')));
const db = process.env.MONGODB_URI || "mongodb://mongodb:27017/todoapp";
console.log("Final connection string being used:", db);
console.log("=== END DEBUG ===");

const connectDb = async () => {
  try {
    await mongoose.connect(db);
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.log("MongoDB connection error:", err);
    setTimeout(connectDb, 5000);
  }
};

export default connectDb;