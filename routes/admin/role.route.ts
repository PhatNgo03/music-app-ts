import { Router } from "express";
import * as controller from "../../controller/admin/role.controller";
import validate from "../../validates/admin/role.validate";
const router: Router = Router();

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", validate.create, controller.createPost);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  validate.edit,
  controller.editPatch,
  );

router.get("/permissions",controller.permissions);
router.patch(
  "/permissions",
  controller.permissionsPatch,
  );
export const roleRoutes : Router = router;