import express from "express";
import path from "path";
import { errorHandler } from "./core/middlewares/error.middleware";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static client assets
const clientBuildPath = path.join(__dirname, "../../client/dist");
app.use(express.static(clientBuildPath));

import authRoutes from "./modules/auth/auth.routes";
import consultationRoutes from "./modules/consultations/consultation.routes";
import settingsRoutes from "./modules/settings/settings.routes";

// Register Modules Routes
app.use("/api/auth", authRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/settings", settingsRoutes);

// Wildcard fallback to index.html for SPA client-side routing (React Router)
app.get("*", (req, res, next) => {
  if (req.accepts("html") && !req.path.startsWith("/api/")) {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  } else {
    next();
  }
});

// Error Handling Middleware
app.use(errorHandler);

export { app };
