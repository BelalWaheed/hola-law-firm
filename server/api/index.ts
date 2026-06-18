import { app } from "../src/app";
import { connectDB } from "../src/core/utils/db";

// Ensure database connection is initialized for serverless requests
connectDB();

export default app;
