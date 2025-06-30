import { internalServerError, response } from "@ariefrahman39/shared-utils"
import type { RequestHandler } from "express"
import prisma from "../../../lib/db"

const patch: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params
    const body = req.body

    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      response(res, 404, "User not found")
      return
    }

    response(res, 200, "User patched successfully", user)
  } catch (error) {
    internalServerError(res, error)
  }
}

export default patch
