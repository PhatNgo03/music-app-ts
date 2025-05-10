import { Router } from "express";
import multer from "multer";
import * as controller from "../../controller/admin/topic.controller";
import validate from "../../validates/topic.validate";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
const router: Router = Router();
const uploadMiddleware = multer(); 

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  uploadMiddleware.single("avatar"), 
  uploadCloud.upload,
  validate.create,
  controller.createPost
);


router.patch("/change-status/:status/:id", controller.changeStatus); //truyen status dong va id dong

router.patch("/change-multi", controller.changeMulti);
export const topicRoutes: Router = router;
