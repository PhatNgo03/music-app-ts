import { Request, Response } from "express";
import Account from "../../models/account.model";
import Role from "../../models/role.model";
import { systemConfig } from "../../config/config";
import md5 from "md5";


// [GET] /admin/my-account/
export const index = async (req: Request, res: Response) => {
  res.render("admin/pages/my-account/index.pug", {
      pageTitle: "Thông tin cá nhân",
  })
}
// [GET] /admin/roles/edit"
export const edit =  async(req: Request, res: Response) => {
  try{
  const find = {
    deleted : false,
    _id: req.params.id
  }
  const accounts = await Account.findOne(find);
  const roles = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/my-account/edit.pug", {
    pageTitle: "Chỉnh sửa thông tin cá nhân",
    accounts: accounts,
    roles: roles
  });
  } catch(error){
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH] /admin/my-account/edit"
export const editPatch = async (req: Request, res: Response) => {
  const id = res.locals.user.id;
 
  // Không cho phép thay đổi email
  delete req.body.email;

  if(req.body.password){
    req.body.password = md5(req.body.password);
  }
  else {
    delete req.body.password;
  }
  try {
    await Account.updateOne({ _id: id }, req.body);
  } catch (error) {
    res.status(500).send("Server error");
  }
  res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
};
