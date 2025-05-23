import { Router } from "express";
import * as controller from "../../controller/admin/auth.controller";
import * as validate from "../../validates/client/user.validate";
const router: Router = Router();

router.get("/login", controller.login);
router.post("/login", 
  validate.login,
  controller.loginPost
);
router.get("/logout", controller.logout);
export const authRoutes : Router = router;