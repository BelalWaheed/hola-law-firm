import jwt from "jsonwebtoken";
import { LoginDTO } from "./auth.schema";
import { getJwtSecret } from "../../core/utils/security";

export class AuthService {
  async login(data: LoginDTO): Promise<{ token: string } | null> {
    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;

    // Fail immediately if environment variables are not configured properly
    if (
      !adminUser ||
      !adminPass ||
      adminUser.trim() === "" ||
      adminPass.trim() === ""
    ) {
      console.error(
        "ADMIN_USER or ADMIN_PASS environment variables are not configured.",
      );
      return null;
    }

    if (data.username === adminUser && data.password === adminPass) {
      const secret = getJwtSecret();
      const token = jwt.sign({ role: "admin", username: adminUser }, secret, {
        expiresIn: "365d",
      });
      return { token };
    }
    return null;
  }
}
