import { Request, Response } from "express";
import Account from "../../models/account.model";
import Role from "../../models/role.model";

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
