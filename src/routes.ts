import { Router } from "express"
import AuthController from "./controllers/auth"
import { AuthMiddleware, response } from "@ariefrahman39/shared-utils"
import UserController from "./controllers/user"

const router = Router()

router.get("/", (req, res) => {
  response(res, 200, "Auth Service is running")
})

router.post("/login", AuthController.login)
router.post("/refresh", AuthController.refresh)
router.post("/logout", AuthController.logout)
router.post(
  "/check",
  // AuthMiddleware.authenticate("admin"),
  AuthController.check
)

router.get(
  "/users",
  AuthMiddleware.authenticate("admin"),
  UserController.getAll
)

router.get(
  "/users/:id",
  AuthMiddleware.authenticate("admin"),
  UserController.getById
)

router.patch(
  "/users/:id",
  AuthMiddleware.authenticate("admin"),
  UserController.patch
)

export default router
