import type { RequestHandler } from "express"
import {
  getAuthToken,
  internalServerError,
  response,
  verifyJwt,
} from "@ariefrahman39/shared-utils"
import getSession from "../utils/get-session"

const check: RequestHandler = async (req, res) => {
  try {
    const session = await getSession(req, res)

    if (!session) {
      response(res, 401, "Invalid refresh token")
      return
    }

    if (session.expiresAt < new Date()) {
      response(res, 401, "Refresh token expired")
      return
    }

    const token = getAuthToken(req)

    response(res, 200, "Session is valid", {
      token: token,
      user: session,
      jwt: await verifyJwt(token, "return"),
    })
  } catch (error) {
    internalServerError(res, error)
  }
}

export default check
