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

  
  for(const item of records){
    //get info user created
    const user = await Account.findOne({
      _id : item.createdBy.account_id
    });

    if(user){
      item.accountFullName = user.fullName;
      (item as any).accountEmail = user.email;
    }

   // get info user updated lasted
    const updatedBy = item.updatedBy?.slice(-1)[0];
    if (updatedBy) {
      const userUpdated = await Account.findOne({
        _id: updatedBy.account_id,
      });
      if (userUpdated) {
        updatedBy.accountFullName = userUpdated.fullName;
        updatedBy.accountEmail = userUpdated.email;
      } else {
        updatedBy.accountFullName = "admin";
        updatedBy.accountEmail = "";
      }
    }

    /// get info user deleted
    if (item.deletedBy?.account_id) {
      const deleter = await Account.findById(item.deletedBy.account_id).lean();
      if (deleter) {
        item.deletedBy.accountFullName = deleter.fullName;
        item.deletedBy.accountEmail = deleter.email;  
      }
    }
  }
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
    req.body.createdBy = {
        account_id: res.locals.user.id
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


// [GET] /admin/roles/edit/:"id"
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
  res.render("admin/pages/accounts/edit", {
    pageTitle: "Chỉnh sửa tài khoản",
    accounts: accounts,
    roles: roles,
  });
  } catch(error){
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH] /admin/accounts/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (req.body.email) {
    delete req.body.email;
  }

  if (req.body.password) {
    req.body.password = md5(req.body.password);
  } else {
    delete req.body.password;
  }

  try {
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    await Account.updateOne({ _id: id }, {
      ...req.body,
      $push:{
        updatedBy: updatedBy
      }
    });
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  } catch (error) {
    res.status(500).send("Server error");
  }
};


// [DELETE] /admin/accounts/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  const id = req.params.id;

  await Account.updateOne(
    {_id: id},
    {
      deleted: true,
      deletedBy: {
      account_id: res.locals.user.id,
      deletedAt: new Date()
    }
    }, 
  );

 res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}



// [GET] /admin/accounts/detail/:"id"
export const detail =  async(req: Request, res: Response) => {
  try{
  const find = {
    deleted : false,
    _id: req.params.id
  }
  const account = await Account.findOne(find).populate('role_id');

  if (account?.createdBy?.account_id) {
    const user = await Account.findOne({ _id: account.createdBy.account_id });
    if (user) {
      (account as any).accountFullName = user.fullName;
      (account as any).accountEmail = user.email; 
    }
  }
  if (account?.deletedBy?.account_id) {
    const deleter = await Account.findById(account.deletedBy.account_id).lean();
    if (deleter) {
      account.deletedBy.accountFullName = deleter.fullName;
      account.deletedBy.accountEmail = deleter.email;
    }
  }
  
  const updatedBy = account?.updatedBy?.slice(-1)[0];
  if (updatedBy) {
    const userUpdated = await Account.findOne({ _id: updatedBy.account_id });
    if (userUpdated) {
      updatedBy.accountFullName = userUpdated.fullName;
      updatedBy.accountEmail = userUpdated.email;
    } else {
      updatedBy.accountFullName = "admin";
      updatedBy.accountEmail = "";
    }
  }
  if (!account) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
  res.render("admin/pages/accounts/detail", {
    pageTitle: account?.title,
    account: account,
  });
  } catch(error){
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

