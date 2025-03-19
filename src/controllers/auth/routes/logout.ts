import type { RequestHandler } from "express"
import { internalServerError, response } from "../../../lib/common"
import prisma from "../../../lib/db"
import getSession from "../utils/get-session"

const logout: RequestHandler = async (req, res) => {
  try {
    const session = await getSession(req, res)

    if (!session) {
      response(res, 401, "Invalid refresh token")
      return
    }

    await prisma.userSession.update({
      where: {
        id: session.id,
      },
      data: {
        revokedAt: new Date(),
      },
    })

    response(res, 200, "Logout successful")
  } catch (error) {
    internalServerError(res, error)
  }
}

export default logout
