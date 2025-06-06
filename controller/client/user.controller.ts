import { Request, Response } from "express";
import User from "../../models/user.model";
const md5 = require("md5");
import crypto from "crypto";
//  [GET] /user/register
export const register = async(req: Request, res: Response) => {
  
  res.render("client/pages/user/register.pug", {
    pageTitle: "Đăng ký tài khoản",
  });
}

//  [GET] /user/registerPost
export const registerPost = async(req: Request, res: Response) => {
  const { password, confirmPassword } = req.body;
  
  if(password != confirmPassword) {
    return res.render("client/pages/user/register.pug", {
      pageTitle: "Đăng ký tài khoản",
      error: "Mật khẩu không khớp",
    });
  }
  const existEmail = await User.findOne({
    email: req.body.email
  });
 if (existEmail) {
    return res.render("client/pages/user/register.pug", {
      pageTitle: "Đăng ký tài khoản",
      error: "Email đã tồn tại",
    });
  }

   
  req.body.password = md5(req.body.password);
  req.body.tokenUser = crypto.randomBytes(16).toString("hex");
  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/topics");
}


// [GET] /user/login
export const login = async (req: Request, res: Response) => {
  res.render("client/pages/user/login.pug", {
    pageTitle: "Đăng nhập",
  });
}

export const loginPost = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, deleted: false });
  if (!user || md5(password) !== user.password || user.status === "inactive") {
    return res.redirect("back");
  }

  // Tạo token mới cho mỗi lần đăng nhập
  const newToken = crypto.randomBytes(16).toString("hex");

  // Cập nhật token mới vào DB
  await User.updateOne({ _id: user._id }, { tokenUser: newToken });

  // Gửi cookie với token mới
  res.cookie("tokenUser", newToken);

  res.redirect("/topics");
}

// [GET] /user/logout
export const logout = async (req:Request, res: Response) => {
  await User.updateOne({
    tokenUser: req.cookies.tokenUser
  });
  //xoa token trong cookie
  res.clearCookie("tokenUser");
  res.redirect("/user/login");
}