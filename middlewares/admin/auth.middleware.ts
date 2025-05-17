import { Request, Response, NextFunction } from "express";
import { systemConfig } from "../../config/config";
import Account from "../../models/account.model";
import Role from "../../models/role.model";

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    }

    const user = await Account.findOne({ token }).select("-password");

    if (!user) {
      return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    }

    const role = await Role.findById(user.role_id);

    res.locals.user = user;
    res.locals.role = role;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
  }
};
