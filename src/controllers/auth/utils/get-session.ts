import type { Request, Response } from "express"
import { response } from "../../../lib/common"
import prisma from "../../../lib/db"

export default async function getSession(req: Request, res: Response) {
  const { refreshToken } = req.body

  if (!refreshToken) {
    response(res, 422, "Request body is missing required fields", {
      refreshToken: "Refresh token is required",
    })
  }

  return await prisma.userSession.findFirst({
    where: {
      token: refreshToken,
      revokedAt: null,
    },
  })
}
