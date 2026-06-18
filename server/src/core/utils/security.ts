import crypto from "crypto";

const FALLBACK_SECRET = crypto.randomBytes(32).toString("hex");

export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      throw new Error(
        "FATAL: JWT_SECRET environment variable is not configured. " +
        "You must configure JWT_SECRET in production/Vercel to prevent session invalidations on cold starts."
      );
    }
    return FALLBACK_SECRET;
  }

  return secret;
};
