import { Router } from "express";
import * as controller from "../../controller/admin/auth.controller";
import * as validate from "../../validates/user.validate";
const router: Router = Router();

router.get("/login", controller.login);
router.post("/login", 
  validate.login,
  controller.loginPost
);

export const authRoutes : Router = router;