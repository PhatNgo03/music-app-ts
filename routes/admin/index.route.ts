import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";
import { topicRoutes } from "./topic.route";
import { systemConfig } from "../../config/config";
import { accountRoutes } from "./account.route";
import * as authMiddleWare from "../../middlewares/admin/auth.middleware";
import { roleRoutes } from "./role.route";
import { authRoutes } from "./auth.route";

const adminRoutes = (app: Express): void => {
  const PATH_ADMIN  = `/${systemConfig.prefixAdmin}`;


  app.use(`${PATH_ADMIN}/dashboard`, authMiddleWare.requireAuth, dashboardRoutes);

  app.use(`${PATH_ADMIN}/topics`, topicRoutes);

  app.use(PATH_ADMIN + "/roles",  authMiddleWare.requireAuth, roleRoutes);

  app.use(PATH_ADMIN + "/accounts",  authMiddleWare.requireAuth, accountRoutes);

  app.use(PATH_ADMIN + "/auth", authRoutes);

};

export default adminRoutes;