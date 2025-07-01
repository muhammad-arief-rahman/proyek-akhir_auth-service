import { internalServerError, response } from "@ariefrahman39/shared-utils"
import type { RequestHandler } from "express"
import prisma from "../../../lib/db"
import { userDataPatchSchema } from "../../../schema/user/data"
import bcrypt from "bcrypt"

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

    const parsedData = userDataPatchSchema.parse(body)

    console.log("Parsed data:", parsedData)

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: parsedData.name,
        email: parsedData.email,
        phone: parsedData.phone,
        password: parsedData.password
          ? await bcrypt.hash(parsedData.password, 10)
          : user.password,
      },
    })

    response(res, 200, "User patched successfully", updatedUser)
  } catch (error) {
    internalServerError(res, error)
  }
}

export default patch
