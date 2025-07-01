import { internalServerError, response } from "@ariefrahman39/shared-utils"
import type { RequestHandler } from "express"
import prisma from "../../../lib/db"
import { userDataPatchSchema } from "../../../schema/user/data"
import bcrypt from "bcrypt"
import axios from "axios"

const patch: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      response(res, 404, "User not found")
      return
    }

    // console.log("Files in request:", req.files)

    const parsedData = userDataPatchSchema.parse({
      ...req.body,
      avatar: ((req.files as Express.Multer.File[]) ?? [])?.find(
        (file) => file.fieldname === "image"
      ),
    })

    // console.log("Parsed data:", parsedData)

    // If the avatar is provided, it will be processed to the media service
    let avatar: string | null = user.avatar

    if (avatar) {
      // Try and destroy the existing avatar if it exists
      await axios.delete(`${process.env.MEDIA_SERVICE_URL}/data/${avatar}`)
    }

    if (parsedData.avatar) {
      // console.log("Uploading new avatar to media service:", parsedData.avatar)

      const formData = new FormData()

      const fileBlob = new Blob([parsedData.avatar.buffer], {
        type: parsedData.avatar.mimetype,
      })

      formData.set("file", fileBlob, parsedData.avatar.originalname)

      const response = await axios.post(
        `${process.env.MEDIA_SERVICE_URL}/data`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      const mediaId = response.data?.data?.[0]

      if (mediaId) {
        avatar = mediaId
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: parsedData.name,
        email: parsedData.email,
        phone: parsedData.phone,
        password: parsedData.password
          ? await bcrypt.hash(parsedData.password, 10)
          : user.password,
        avatar: avatar,
      },
    })

    response(res, 200, "User patched successfully", updatedUser)
  } catch (error) {
    console.error("Error in patch user controller:", error)

    internalServerError(res, error)
  }
}

export default patch
