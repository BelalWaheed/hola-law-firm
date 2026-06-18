"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../src/app");
const db_1 = require("../src/core/utils/db");
// Ensure database connection is initialized for serverless requests
(0, db_1.connectDB)().catch((err) => {
    console.error("Vercel database warm-up failed:", err);
});
exports.default = app_1.app;
