import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import { tree } from "../../helpers/createTree"
import { systemConfig } from "../../config/config";
// [GET] /admin/topics
export const index = async (req: Request, res: Response) => {
  try {
    res.render("admin/pages/topics/index", {
        pageTitle: "Quản lý chủ đề ",
      });
  } catch (error) {
    res.status(500).send("Server error");
  }
};



// [GET] /admin/product-category/create
export const create =  async(req: Request, res: Response) => {
  try {
    let find = {
      deleted: false
    } 
    const records = await Topic.find(find);
    const newRecords = tree(records);
    res.render("admin/pages/topics/create.pug", {
      pageTitle: "Tạo chủ đề bài hát",
      records : newRecords
  })
  } catch (error) {
    res.status(500).send("Server error");
  }
 

 
}
// [POST] /admin/products/create
export const createPost =  async(req: Request, res: Response) => {
  if(req.body.position == ""){
    const count= await Topic.countDocuments();
    req.body.position = count + 1;
  }
  else{
    req.body.position= parseInt(req.body.position);
  }
  const record = new Topic(req.body);
  await record.save();
    res.redirect(`/${systemConfig.prefixAdmin}/topics`);

}
