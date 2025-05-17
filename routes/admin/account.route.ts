import { Router } from "express";
import * as controller from "../../controller/admin/account.controller";
const router: Router = Router();


router.get("/", controller.index);

export const accountRoutes : Router = router;