import { Request, Response } from "express";
import Role from "../../models/role.model";

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
