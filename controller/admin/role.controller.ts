import { Request, Response } from "express";
import Role from "../../models/role.model";
import { systemConfig } from "../../config/config";

// [GET] /admin/roles
export const index = async (req: Request, res: Response) => {
  let find = {
    deleted :false
  }
  const records = await Role.find(find);
  res.render("admin/pages/roles/index.pug", {
      pageTitle: "Nhóm quyền",
      records:records
  })
}

// [GET] /admin/roles/create
export const create = async (req: Request, res: Response) => {
  try {
    res.render("admin/pages/roles/create.pug", {
      pageTitle: "Tạo mới nhóm quyền",
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
 
}

// [GET] /admin/roles/create
export const createPost = async (req: Request, res: Response) => {
  
  const record = new Role(req.body);
  await record.save();

  res.redirect(`/${systemConfig.prefixAdmin}/roles`);
}


// [GET] /admin/roles/edit/:"id"
export const edit =  async(req: Request, res: Response) => {
  try{
  const find = {
    deleted : false,
    _id: req.params.id
  }
  const roles = await Role.findOne(find);

  res.render("admin/pages/roles/edit", {
    pageTitle: "Chỉnh sửa nhóm quyền",
    roles: roles,
  });
  } catch(error){
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
  }
};

// [PATCH] /admin/roles/edit/:"id"
export const editPatch = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await Role.updateOne({ _id: id }, req.body);
  } catch (error) {
    res.status(500).send("Server error");
  }
  res.redirect(`/${systemConfig.prefixAdmin}/roles`);
};

// [Get] /admin/roles/permission"
export const permissions = async (req: Request, res: Response) => {
  try {
    let find = {
      deleted :false 
    }
    const records = await Role.find(find);

    res.render("admin/pages/roles/permissions", {
      pageTitle: "Phân quyền",
      records: records,
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

// [PATCH] /admin/roles/permissionsPatch"
export const permissionsPatch = async (req: Request, res: Response) => {
  const permissions = JSON.parse(req.body.permissions);
  try{
    for(const item of permissions){
      await Role.updateOne({_id: item.id}, {permissions: item.permissions})
    }
   res.redirect(`/${systemConfig.prefixAdmin}/roles/permissions`);
  }
  catch(error){
    res.status(500).send("Server error");
  }
};