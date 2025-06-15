import { Request, Response } from "express";
import UserModel from "../../models/user.model";

// [GET] /admin/accounts
export const index = async (req :Request, res: Response) => {
  let find = {
    deleted :false
  }
  const records = await UserModel.find(find).select("-password -token");

res.render("admin/pages/users/index.pug", {
    pageTitle: "Danh sách tài khoản",
    records : records
})
}
