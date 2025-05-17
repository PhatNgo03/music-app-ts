import { Request, Response } from "express";
import Account from "../../models/account.model";
import Role from "../../models/role.model";
import { systemConfig } from "../../config/config";
import mongoose from "mongoose";
import md5 from "md5";

// [GET] /admin/accounts
export const index = async (req :Request, res: Response) => {
  let find = {
    deleted :false
  }
  const records = await Account.find(find).select("-password -token");

  for (const record of records) {
  const role = await Role.findOne({
    _id: record.role_id,
    deleted: false   
  });

  (record as any).role = role;
}

res.render("admin/pages/accounts/index.pug", {
    pageTitle: "Danh sách tài khoản",
    records : records
})
}


// [GET] /admin/accounts/create
export const create = async (req: Request, res: Response) => {

  const roles = await Role.find({
    deleted :false
  })
  res.render("admin/pages/accounts/create.pug", {
      pageTitle: "Tạo mới tài khoản",
      roles: roles,
  })
}

// [GET] /admin/accounts/create
export const createPost = async (req: Request, res: Response) => {
  try {
    const { role_id, email, password } = req.body;

    const emailExist = await Account.findOne({
      email: email,
      deleted: false
    });
    if (emailExist) {
      console.error("Email đã tồn tại", email);
      return res.redirect(`/${systemConfig.prefixAdmin}/accounts/create`);
    }


    if (!mongoose.Types.ObjectId.isValid(role_id)) {
      console.error("role_id không hợp lệ:", role_id);
      return res.status(400).render("admin/pages/auth/login.pug", {
        pageTitle: "Đăng nhập",
        errorMessage: "Role không hợp lệ"
      });
    }

    const hashedPassword = md5(password);

    const record = new Account({
      ...req.body,
      password: hashedPassword,
      role_id: new mongoose.Types.ObjectId(role_id)
    });

    await record.save();
    return res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  } catch (error) {
    console.error("Lỗi khi tạo account:", error);
    return res.status(500).render("admin/pages/auth/login.pug", {
      pageTitle: "Đăng nhập",
      errorMessage: "Có lỗi xảy ra khi tạo tài khoản"
    });
  }
};