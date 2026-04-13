import mongoose from 'mongoose';

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // Check if we are already connected to the database
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    //Try to connect to the database
    const db = await mongoose.connect(process.env.MONGODB_URI || "");

    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database:", error);
    // Throw the error 
    throw new Error("Database connection failed");
  }
}

export default dbConnect;