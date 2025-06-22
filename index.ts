import express from "express"
import multer from "multer"
import router from "./src/routes"
import { response } from "@ariefrahman39/shared-utils"

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(multer().any())

app.use("/", router)

app.use((req, res) => {
  response(res, 404, "Not Found")
})

app.listen(port, () => {
  console.log(`Auth-Service is running on port ${port}`)
})
