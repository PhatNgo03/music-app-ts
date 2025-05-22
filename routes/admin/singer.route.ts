import { Router } from "express";
import * as controller from "../../controller/admin/singer.controller";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
import multer from "multer";
import validate from "../../validates/admin/singer.validate";
const uploadMiddleware = multer(); 
const router: Router = Router();


router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create",
  uploadMiddleware.single("avatar"),
  uploadCloud.upload,
  validate.create,
  controller.createPost
)

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  uploadMiddleware.single("avatar"),
  uploadCloud.upload,
  validate.edit,
  controller.editPatch,
  );

router.delete("/delete/:id", controller.deleteItem);

router.get("/detail/:id", controller.detail);

router.patch("/change-status/:status/:id", controller.changeStatus); 

router.patch("/change-multi", controller.changeMulti);

export const singerRoutes : Router = router;