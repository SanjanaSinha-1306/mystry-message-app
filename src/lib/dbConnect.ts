import mongoose from 'mongoose';

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // Check if we have a connection or if one is currently connecting
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    // Use the correct variable name and remove deprecated options
    const db = await mongoose.connect(process.env.MONGODB_URI || "");

    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database:", error);
    // Throw the error so the API route can catch it instead of crashing the server
    throw new Error("Database connection failed");
  }
}

export default dbConnect;