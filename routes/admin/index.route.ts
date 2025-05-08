import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";
import { topicRoutes } from "./topic.route";
import { systemConfig } from "../../config/config";


const adminRoutes = (app: Express): void => {
  const PATH_ADMIN  = `/${systemConfig.prefixAdmin}`;


  app.use(`${PATH_ADMIN}/dashboard`, dashboardRoutes);

  app.use(`${PATH_ADMIN}/topics`, topicRoutes);

};

export default adminRoutes;