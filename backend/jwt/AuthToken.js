import jwt from "jsonwebtoken";
import { User } from "../Models/userModel.js";

// ==========================================
// TOKEN GENERATION & COOKIE ATTACHMENT
// ==========================================
/**
 * Generates signed JWT token and saves it in httpOnly response cookie
 */
const createTokenAndSaveCookies = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });

  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 30;
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: cookieExpireDays * 24 * 60 * 60 * 1000,
  });

  await User.findByIdAndUpdate(userId, { token });
  return token;
};

export default createTokenAndSaveCookies;