import { Router } from "express";
import * as controller from "../../controller/admin/song.controller";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
import multer from "multer";
import validate from "../../validates/admin/song.validate";
const uploadMiddleware = multer(); 
const router: Router = Router();


router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create",
  uploadMiddleware.fields([
    {name: "avatar", maxCount: 1 },
    {name: "audio", maxCount: 1}
  ]),
  uploadCloud.uploadFields,
  validate.create,
  controller.createPost
)

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  uploadMiddleware.fields([
    {name: "avatar", maxCount: 1 },
    {name: "audio", maxCount: 1}
  ]),
  uploadCloud.uploadFields,
  validate.edit,
  controller.editPatch,
  );

router.delete("/delete/:id", controller.deleteItem);

router.get("/detail/:id", controller.detail);

router.patch("/change-status/:status/:id", controller.changeStatus); 

router.patch("/change-multi", controller.changeMulti);

export const songRoutes : Router = router;