import mongoose from "mongoose";

// Development/Local connection (fallback)
const localDb = "mongodb://localhost:27017/todoapp";


const getConnectionString = () => {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }
  
  return localDb;
};

const connectDb = () => {
  const connectionString = getConnectionString();
  
  console.log("Attempting to connect to:", connectionString.replace(/\/\/([^:]+):([^@]+)@/, "//*****:*****@"));
  
  return mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      heartbeatFrequencyMS: 2000, // Check connection every 2s
    })
    .then(() => {
      console.log("✅ Connected to MongoDB successfully");
      console.log("Database:", mongoose.connection.name);
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      process.exit(1); // Exit if cannot connect to database
    });
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

export default connectDb;