import mongoose from "mongoose";

let cachedConnection: Promise<typeof mongoose> | null = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (cachedConnection) {
    try {
      await cachedConnection;
      return;
    } catch (error) {
      cachedConnection = null; // Reset cache on failure to allow retry
      throw error;
    }
  }

  const atlasUri = process.env.MONGO_URI;
  const localUri = process.env.MONGO_URI_LOCAL || "mongodb://127.0.0.1:27017/hola_law_firm";

  const isAtlasPlaceholder = atlasUri ? (atlasUri.includes("<username>") || atlasUri.includes("<password>")) : true;

  if (atlasUri && !isAtlasPlaceholder) {
    try {
      console.log("Attempting to connect to configured MongoDB database...");
      cachedConnection = mongoose.connect(atlasUri);
      await cachedConnection;
      console.log("Successfully connected to configured MongoDB database");
      return;
    } catch (error) {
      cachedConnection = null; // Reset cache on failure to allow retry
      console.error("Database connection failed:", error);
      throw error;
    }
  }

  // Fallback to local DB ONLY if MONGO_URI is missing or contains placeholders
  console.log("MONGO_URI not configured. Attempting connection to local MongoDB database...");
  try {
    console.log(`Attempting to connect to local MongoDB: ${localUri}`);
    cachedConnection = mongoose.connect(localUri);
    await cachedConnection;
    console.log("Successfully connected to local MongoDB");
  } catch (error) {
    cachedConnection = null; // Reset cache on failure to allow retry
    console.error("Local MongoDB connection failed:", error);
    throw error;
  }
};

