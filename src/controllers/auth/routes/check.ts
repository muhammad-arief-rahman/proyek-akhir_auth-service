import type { RequestHandler } from "express"
import { internalServerError, response } from "../../../lib/common"
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

    response(res, 200, "Token is valid")
  } catch (error) {
    internalServerError(res, error)
  }
}

export default check
