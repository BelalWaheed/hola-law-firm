import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const atlasUri = process.env.MONGO_URI;
  const localUri = process.env.MONGO_URI_LOCAL || "mongodb://127.0.0.1:27017/hola_law_firm";

  const isAtlasPlaceholder = atlasUri ? (atlasUri.includes("<username>") || atlasUri.includes("<password>")) : true;

  if (atlasUri && !isAtlasPlaceholder) {
    try {
      console.log("Attempting to connect to configured MongoDB database...");
      await mongoose.connect(atlasUri);
      console.log("Successfully connected to configured MongoDB database");
      return;
    } catch (error) {
      console.error("Database connection failed:", error);
      throw error;
    }
  }

  // Fallback to local DB ONLY if MONGO_URI is missing or contains placeholders
  console.log("MONGO_URI not configured. Attempting connection to local MongoDB database...");
  try {
    console.log(`Attempting to connect to local MongoDB: ${localUri}`);
    await mongoose.connect(localUri);
    console.log("Successfully connected to local MongoDB");
  } catch (error) {
    console.error("Local MongoDB connection failed:", error);
    throw error;
  }
};

