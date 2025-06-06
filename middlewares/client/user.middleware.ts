import { Request, Response, NextFunction } from "express";

import User from "../../models/user.model";

export const infoUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  res.locals.user = null;

  const token = req.cookies.tokenUser;

  if (token) {
    const user = await User.findOne({
      tokenUser: token,
      deleted: false,
      status: "active"
    }).select("-password");

    if (user) {
      res.locals.user = user;
    } else {
      res.clearCookie("tokenUser");
    }
  }

  next();
};
