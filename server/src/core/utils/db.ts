import mongoose from "mongoose";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  const atlasUri = process.env.MONGO_URI;
  const localUri =
    process.env.MONGO_URI_LOCAL || "mongodb://127.0.0.1:27017/hola_law_firm";

  const isAtlasPlaceholder = atlasUri
    ? atlasUri.includes("<username>") || atlasUri.includes("<password>")
    : true;

  // Determine URI based on environment
  let uri = localUri;
  let isAtlas = false;
  if (atlasUri && !isAtlasPlaceholder) {
    uri = atlasUri;
    isAtlas = true;
  } else if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    // On Vercel or in production, we MUST have a valid MONGO_URI.
    // Falling back to 127.0.0.1 will just cause timeouts and lambda crashes.
    throw new Error(
      "MONGO_URI is not properly configured for production. Please set a valid MongoDB Atlas URI."
    );
  }

  if (!cached.promise) {
    console.log(`Attempting to connect to ${isAtlas ? "MongoDB Atlas (Online)" : "local MongoDB"}...`);
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log(`Successfully connected to ${isAtlas ? "MongoDB Atlas (Online)" : "local MongoDB"}`);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Reset cache on failure to allow retry
    console.error("MongoDB connection failed:", error);
    throw error;
  }

  return cached.conn;
};
