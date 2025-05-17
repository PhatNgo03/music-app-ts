import { Request, Response } from "express";
import Account from "../../models/account.model";
import { systemConfig } from "../../config/config";
import md5 from "md5";
// [GET] /admin/auth/login
export const login = async (req: Request, res: Response) => {
  if(req.cookies.token) {
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`)
  }else {
    res.render("admin/pages/auth/login.pug", {
      pageTitle: "Đăng nhập",
  });
  }
}

// [POST] /admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  // const {email, password} = req.body;

  const user = await Account.findOne({
    email: email,
    deleted : false
  });

  if(!user) {
    res.redirect("back");
    return;
  }
  if(md5(password) != user.password){
    res.redirect("back");
    return;
  }
  if(user.status == "inactive"){
    res.redirect("back");
    return;
  }
  res.cookie("token", user.token, {
  httpOnly: true,
  path: "/", 
  sameSite: "lax", 
});

  res.redirect(`/admin/dashboard`);
 
}