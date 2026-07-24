import { SignJWT } from "jose";
import { JWT_SECRET } from "./getJwtSecret.js";

// Generate a JWT token
// @param {object} Payload- Data to embed in the token
// @param {string} expiresIn - The expiration time of the token (e.g: '15m', '1h', '7d')
// @returns {Promise<string>} - The generated JWT token
export const generateToken = async (payload, expiresIn = "15m") => {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(expiresIn)
        .setIssuedAt()
        .sign(JWT_SECRET);
};