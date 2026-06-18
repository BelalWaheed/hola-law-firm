import { app } from "./app";
import { connectDB } from "./core/utils/db";

const PORT = process.env.PORT || 5000;

// Database connection
connectDB().catch((err) => {
  console.error("Critical: Database connection failed during startup.", err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
