import crypto from "crypto";

const FALLBACK_SECRET = crypto.randomBytes(32).toString("hex");

export const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || FALLBACK_SECRET;
};
