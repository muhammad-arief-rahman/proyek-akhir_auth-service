import { Router } from "express"
import AuthController from "./controllers/auth"

const router = Router()

router.post("/login", AuthController.login)
router.post("/refresh", AuthController.refresh)
router.post("/logout", AuthController.logout)
router.post("/check", AuthController.check)

export default router
