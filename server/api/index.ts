import { app } from "../src/app";
import { connectDB } from "../src/db";

// Ensure database connection is initialized for serverless requests
connectDB().catch((err) => {
  console.error("Vercel database warm-up failed:", err);
});

export default app;
