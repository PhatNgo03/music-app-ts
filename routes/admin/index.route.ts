import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";
import { topicRoutes } from "./topic.route";
import { systemConfig } from "../../config/config";
import { accountRoutes } from "./account.route";
import * as authMiddleWare from "../../middlewares/admin/auth.middleware";
import { roleRoutes } from "./role.route";
import { authRoutes } from "./auth.route";
import { singerRoutes } from "./singer.route";
import { myAccountRouters } from "./my-account.route";
import { songRoutes } from "./song.route";
import { uploadRoutes } from "./upload.route";
import { settingRoutes } from "./setting.route";

const adminRoutes = (app: Express): void => {
  const PATH_ADMIN  = `/${systemConfig.prefixAdmin}`;


  app.use(`${PATH_ADMIN}/dashboard`, authMiddleWare.requireAuth, dashboardRoutes);

  app.use(`${PATH_ADMIN}/topics`,authMiddleWare.requireAuth, topicRoutes);

  app.use(PATH_ADMIN + "/roles",  authMiddleWare.requireAuth, roleRoutes);

  app.use(PATH_ADMIN + "/accounts", authMiddleWare.requireAuth, accountRoutes);

  app.use(PATH_ADMIN + "/singers", authMiddleWare.requireAuth, singerRoutes);

  app.use(PATH_ADMIN + "/my-account", authMiddleWare.requireAuth, myAccountRouters);

  app.use(PATH_ADMIN + "/songs", authMiddleWare.requireAuth, songRoutes);

  
  app.use(PATH_ADMIN + "/upload", authMiddleWare.requireAuth, uploadRoutes);

  app.use(PATH_ADMIN + "/settings", authMiddleWare.requireAuth, settingRoutes);

  app.use(PATH_ADMIN + "/auth", authRoutes);


};

export default adminRoutes;