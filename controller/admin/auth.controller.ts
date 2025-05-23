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
  const { email, password } = req.body;

  const user = await Account.findOne({
    email,
    deleted: false
  });

  if (!user) {
    console.log(`Login failed: Email không tồn tại - Email: ${email}`);
    return res.status(401).render("admin/pages/auth/login.pug", {
      pageTitle: "Đăng nhập",
      errorMessage: "Email không tồn tại"
    });
  }

  if (md5(password) !== user.password) {
    console.log(`Login failed: Mật khẩu không đúng - Email: ${email}`);
    return res.status(401).render("admin/pages/auth/login.pug", {
      pageTitle: "Đăng nhập",
      errorMessage: "Mật khẩu không đúng"
    });
  }

  if (user.status === "inactive") {
    console.log(`Login failed: Tài khoản chưa được kích hoạt - Email: ${email}`);
    return res.status(403).render("admin/pages/auth/login.pug", {
      pageTitle: "Đăng nhập",
      errorMessage: "Tài khoản chưa được kích hoạt"
    });
  }

  // Set cookie token
  res.cookie("token", user.token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  res.redirect(`/admin/dashboard`);
};

// [GET] /admin/auth/logout
export const logout = async (req: Request, res: Response) => {
  //xoa token trong cookie
  res.clearCookie("token");
  res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
}
