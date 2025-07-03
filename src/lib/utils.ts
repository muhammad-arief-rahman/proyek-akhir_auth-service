import * as jose from "jose"
import { ACCESS_TOKEN_DURATION } from "./constants"

const secret = new TextEncoder().encode(process.env.JWT_SECRET as string)

export async function generateJwt<T>(
  payload: Record<string, T>,
  expiresIn = ACCESS_TOKEN_DURATION
) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("auth-service")
    .setExpirationTime(Math.floor(new Date().getTime() / 1000 + expiresIn))
    .sign(secret)
}